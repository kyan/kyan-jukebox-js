#!/usr/bin/env ruby

require 'rubygems'
require 'bundler/setup'
Bundler.require(:default)
require 'json'
require 'date'

PROGRESS_FORMAT = '(%c/%C) <%B> %p%% Progress'
Mongo::Logger.logger.level = Logger::FATAL

users = File.open('users.json')
data = File.open('commands.json')
users = JSON.load(users)
data = JSON.load(data)

# get all the users we care about
users_with_uids = users.map do |u|
  u['id'] if u.key?('uid')
end.compact.uniq

# filter data by users we care about
data = data.map do |v|
  v if users_with_uids.include?(v['user_id'])
end.compact

client = Mongo::Client.new('mongodb://localhost:27017/jb-dev')

progressbar = ProgressBar.create(
  format: "[TRACKS] #{PROGRESS_FORMAT}",
  total: data.size
)

tracks = client[:tracks]

data.each do |item|
  user = users.find { |u| u['id'] == item['user_id'] }
  track = tracks.find( { _id: item['parameters'] } ).first
  created_at = DateTime.parse(item['created_at']).to_time.utc

  if track
    added_by = track['addedBy'].sort_by { |t| t[:addedAt] }.reverse
    metrics = track['metrics']

    if added_by.size > 0
      last_added = added_by.first['addedAt']
      mins = 30 * 60
      next if created_at < (last_added + mins)

      added_by << {
        user: user['uid'],
        addedAt: created_at,
        played: [
          { at: created_at }
        ],
        votes: []
      }
      metrics['plays'] = metrics['plays'] + 1
    else
      added_by << {
        user: user['uid'],
        addedAt: created_at,
        played: [
          { at: created_at }
        ],
        votes:[]
      }
      metrics['plays'] = 1
    end

    tracks.replace_one(
      { "_id": item['parameters'] },
      {
        "$set": {
          addedBy: added_by.sort_by { |t| t[:addedAt] }.reverse,
          metrics: metrics
        }
      }
    )
  else
    tracks.insert_one({
      _id: item['parameters'],
      addedBy: [
        {
          user: user['uid'],
          addedAt: created_at,
          played: [
            { at: created_at }
          ],
          votes:[]
        }
      ],
      metrics: {
        plays: 1,
        votes: 0,
        votesAverage: 0,
        votesTotal: 0
      }
    })
  end

  progressbar.increment
end.compact
