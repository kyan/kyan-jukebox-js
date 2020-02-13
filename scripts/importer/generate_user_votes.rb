#!/usr/bin/env ruby

require 'rubygems'
require 'bundler/setup'
require 'ruby-progressbar'
require 'json'
require 'date'

PROGRESS_FORMAT = '(%c/%C) <%B> %p%% Progress'

users = File.open('users.json')
votes = File.open('votes.json')
tracks = File.open('tracks.json')

votes = JSON.load(votes)
users = JSON.load(users)
tracks = JSON.load(tracks)

# get all the users we care about
users_with_uids = users.map do |u|
  u['id'] if u.key?('uid')
end.compact.uniq

# filter votes by users we care about
votes = votes.map do |v|
  v if users_with_uids.include?(v['user_id'])
end.compact

progressbar = ProgressBar.create(
  format: "[VOTES] #{PROGRESS_FORMAT}",
  total: votes.size
)

updated_votes = votes.map do |vote|
  user = users.find { |u| u['id'] == vote['user_id'] }
  track = tracks.find { |t| t['id'] == vote['track_id'] }
  progressbar.increment

  if track && user && user.key?('uid')
    vote['uid'] = user['uid']
    vote['track_uri'] = track['filename']
    vote['track_created'] = track['created_at']
    vote['vote'] = vote['aye'] ? 70 : 30

    vote.delete('id')
    vote.delete('user_id')
    vote.delete('track_id')
    vote.delete('aye')
    vote.delete('updated_at')
    vote.delete('filename')
    vote
  end
end.compact.sort_by { |t| DateTime.parse(t['created_at']) }

File.open("user_votes.json","w") do |f|
  f.write(updated_votes.to_json)
end
