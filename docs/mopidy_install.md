## Mopidy on a Raspberry Pi Model B

These instructions help you install Mopidy onto a Raspberry Pi Model B. It is assumed the Pi will be running the latest version of Raspian.

* Get Raspian OS https://downloads.raspberrypi.org/raspbian_lite/images/raspbian_lite-2019-04-09/2019-04-08-raspbian-stretch-lite.zip (we're using stetch because Buster seems to have issues currently where we can't get global events from Mopidy)
* Stick image on SD card that will fit inside the PI
* https://www.raspberrypi.org/documentation/installation/installing-images/mac.md
* Stick the SD card into the PI and fire it up with a keyboard and monitor plugged in
* Login with ‘pi’ and password ‘raspberry’

###  Mopidy

Add the archive’s GPG key:
```
$ wget -q -O - https://apt.mopidy.com/mopidy.gpg | sudo apt-key add -
```
Add the APT repo to your package sources:
```
$ sudo wget -q -O /etc/apt/sources.list.d/mopidy.list https://apt.mopidy.com/jessie.list
```
Install Mopidy and any 3rd Party extensions you may want:
```
$ sudo apt-get update
$ sudo apt-get install mopidy

$ sudo apt-get install mopidy-spotify
```

### Config

Once installed you can now configure by editing `/etc/mopidy/mopidy.conf`.

```
# /etc/mopidy/mopidy.conf

[core]
cache_dir = /var/cache/mopidy
config_dir = /etc/mopidy
data_dir = /var/lib/mopidy

[audio]
# Only needed if running Icecast2
# output = tee name=t ! queue ! audioresample ! autoaudiosink t. ! queue ! lamemp3enc ! shout2send mount=radio ip=127.0.0.1 port=8000 password=hackme
mixer_volume = 40

[logging]
config_file = /etc/mopidy/logging.conf
debug_file = /var/log/mopidy/mopidy-debug.log

[local]
enabled = false
#media_dir = /var/lib/mopidy/media

[m3u]
#playlists_dir = /var/lib/mopidy/playlists

[file]
enabled = false

[http]
enabled = true
hostname = 0.0.0.0
port = 6680
static_dir =

[spotify]
enabled = true
username = xxx
password = xxx
client_id = xxx
client_secret = xxx
#private_session = true

[mpd]
enabled = true
hostname = 0.0.0.0
port = 6600
#password =
max_connections = 20
connection_timeout = 60
zeroconf = Mopidy MPD server on $hostname
command_blacklist =
  listall
  listallinfo
default_playlist_scheme = m3u
```

### Running Mopidy as Service

```
$ sudo systemctl enable mopidy
```

Mopidy is started, stopped, and restarted just like any other systemd service:
```
$ sudo systemctl start mopidy
$ sudo systemctl stop mopidy
$ sudo systemctl restart mopidy
```
You can check if Mopidy is currently running as a service by running:
```
$ sudo systemctl status mopidy
...
● mopidy.service - Mopidy music server
   Loaded: loaded (/lib/systemd/system/mopidy.service; enabled; vendor preset: enabled)
   Active: active (running) since Wed 2018-03-07 16:57:22 UTC; 17h ago
  Process: 1849 ExecStartPre=/bin/chown mopidy:audio /var/cache/mopidy (code=exited, status=0/SUCCESS)
  Process: 1846 ExecStartPre=/bin/mkdir -p /var/cache/mopidy (code=exited, status=0/SUCCESS)
 Main PID: 1851 (mopidy)
   CGroup: /system.slice/mopidy.service
           └─1851 /usr/bin/python /usr/bin/mopidy --config /usr/share/mopidy/conf.d:/etc/mopidy/mopidy.conf

Mar 07 16:57:35 jukebox-api mopidy[1851]: INFO     MPD server running at [::ffff:0.0.0.0]:6600
Mar 07 16:57:35 jukebox-api mopidy[1851]: INFO     HTTP server running at [::ffff:0.0.0.0]:6680
```

### Audio

You can test sound output independent of Mopidy by running:
```
$ aplay /usr/share/sounds/alsa/Front_Center.wav
```
If you hear a voice saying “Front Center”, then your sound is working. If you want to change your audio output setting, simply rerun sudo raspi-config

#### Audio aliases

Here’s are some alias you can add to `~.bashrc` to control the volume of the PI as by default it’s very quiet.

INCREASE VOLUME BY 5%
```
alias volu='sudo amixer set PCM -- $[$(amixer get PCM|grep -o [0-9]*%|sed 's/%//')+5]%'
```
DECREASE VOLUME BY 5%
```
alias vold='sudo amixer set PCM -- $[$(amixer get PCM|grep -o [0-9]*%|sed 's/%//')-5]%'
```

### MPC

Allows you to control Mopidy via the command line on the PI

```
$ sudo apt-get install mpc
```

#### Example usage

```
mpc add "spotify:track:0c41pMosF5Kqwwegcps8ES"
mpc playlist
mpc play 1
```

### Date

Setting the correct data on your Pi

```
$ sudo dpkg-reconfigure tzdata
```

### Node.js and Yarn

These will be useful if you are running the Jukebox

```
$ curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
$ sudo apt-get install -y nodejs
$ curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
$ echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
$ sudo apt-get update && sudo apt-get install yarn
```
