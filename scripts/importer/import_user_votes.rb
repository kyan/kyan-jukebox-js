#!/usr/bin/env ruby

require 'rubygems'
require 'bundler/setup'
Bundler.require(:default)
require 'json'

PROGRESS_FORMAT = '(%c/%C) <%B> %p%% Progress'
Mongo::Logger.logger.level = Logger::FATAL

data = File.open('user_votes.json')
data = JSON.load(data)

client = Mongo::Client.new('mongodb://localhost:27017/kyan-jukebox')

progressbar = ProgressBar.create(
  format: "[USER VOTES] #{PROGRESS_FORMAT}",
  total: data.size
)

tracks = client[:tracks]

data.each do |vote|
  track = tracks.find( { _id: vote['track_uri'] } ).first

  if track
    added_by = track['addedBy']
    created_at_time = DateTime.parse(vote['created_at']).to_time.utc
    next if added_by.empty?

    if added_by.size > 1
      added_by_sorted = added_by.sort_by do |a|
        (a['addedAt'].to_time - created_at_time).abs
      end

      if created_at_time > added_by_sorted.first['addedAt'].to_time
        added_by_sorted.first['votes'].unshift({
          at: created_at_time,
          vote: vote['vote'],
          user: vote['uid']
        })

        total_votes = added_by_sorted.map do |a|
          a[:votes].map {|v| v[:vote] }
        end.flatten
        total_total_votes = total_votes.inject(0) { |sum,x| sum + x }
        average_total_votes = (total_total_votes / total_votes.length).round

        metrics = {
          plays: track['metrics']['plays'],
          votes: track['metrics']['votes'] + 1,
          votesAverage: average_total_votes,
          votesTotal: total_total_votes
        }

        tracks.replace_one(
          { "_id": vote['track_uri'] },
          {
            "$set": {
              addedBy: added_by_sorted.sort_by { |t| t['addedAt'] }.reverse,
              metrics: metrics
            }
          }
        )
      end
    end
  end

  progressbar.increment
end.compact
