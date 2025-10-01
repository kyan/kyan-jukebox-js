FROM debian:bookworm-slim

ENV TZ "Etc/UTC"

# Install basic tools
RUN apt-get update \
  && DEBIAN_FRONTEND=noninteractive apt-get install -y tzdata gpg wget

# Add Mopidy repository
RUN mkdir -p /etc/apt/keyrings \
  && wget -q -O /etc/apt/keyrings/mopidy-archive-keyring.gpg https://apt.mopidy.com/mopidy.gpg \
  && wget -q -O /etc/apt/sources.list.d/mopidy.list https://apt.mopidy.com/bookworm.list

# Update package lists
RUN apt-get update

# Install basic dependencies
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y \
  python3-pip \
  curl \
  dumb-init \
  gstreamer1.0-plugins-good \
  gstreamer1.0-plugins-ugly

# Install mopidy core
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y mopidy

# Install gst-plugin-spotify (GStreamer Spotify plugin) for arm64
# Using pre-built packages from kingosticks/gst-plugins-rs-build
RUN wget -q https://github.com/kingosticks/gst-plugins-rs-build/releases/download/gst-plugin-spotify_0.15.0-alpha.1-3/gst-plugin-spotify_0.15.0.alpha.1-3_arm64.deb \
  && DEBIAN_FRONTEND=noninteractive apt-get install -y ./gst-plugin-spotify_0.15.0.alpha.1-3_arm64.deb \
  && rm gst-plugin-spotify_0.15.0.alpha.1-3_arm64.deb \
  && gst-inspect-1.0 spotifyaudiosrc

# Install mopidy-spotify via pip (not available in apt repository)
# Bookworm has PEP 668 so we need --break-system-packages or use a venv
# See: https://github.com/mopidy/mopidy-spotify
RUN python3 -m pip install --break-system-packages mopidy-spotify==5.0.0a3

# Cleanup
RUN apt-get clean \
  && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Prepare runtime paths
RUN mkdir -p /config \
  && chown -R mopidy:audio /config



# Switch to user mopidy with group audio.
USER mopidy:audio

# Start helper script.
COPY ./entrypoint.sh /entrypoint.sh

# Default configuration.
COPY ./config/mopidy.conf /config/mopidy.conf

# Copy the pulse-client configuration.
COPY ./config/pulse-client.conf /etc/pulse/client.conf

EXPOSE 6600 6680 5555/udp

ENTRYPOINT ["/usr/bin/dumb-init", "/entrypoint.sh"]
CMD ["/usr/bin/mopidy"]

HEALTHCHECK --interval=5s --timeout=2s --retries=20 \
  CMD curl --connect-timeout 5 --silent --show-error --fail http://localhost:6680/ || exit 1
