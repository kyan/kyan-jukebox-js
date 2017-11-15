export default function(json) {
  let payload = {
    uri: json.uri,
    name: json.name,
    year: json.date,
    length: json.length,
    album: {
      uri: json.album.uri,
      name: json.album.name
    }
  };

  if (json.artists.length > 0) {
    let artist = {
      uri: json.artists[0].uri,
      name: json.artists[0].name
    };
    payload.artist = artist;
  }

  return { track: payload };
}
