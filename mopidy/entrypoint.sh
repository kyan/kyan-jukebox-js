#!/bin/bash

if [ -z "$PULSE_COOKIE_DATA" ]
then
    echo -ne $(echo $PULSE_COOKIE_DATA | sed -e 's/../\\x&/g') >$HOME/pulse.cookie
    export PULSE_COOKIE=$HOME/pulse.cookie
fi

MOPIDY_CONF='/config/mopidy.conf'
if [[ -f "$MOPIDY_CONF" ]]; then
  sed -i "s~%MOPIDY_USERNAME%~$MOPIDY_USERNAME~g; s~%MOPIDY_PASSWORD%~$MOPIDY_PASSWORD~g; s~%MOPIDY_CLIENT_ID%~$MOPIDY_CLIENT_ID~g; s~%MOPIDY_CLIENT_SECRET%~$MOPIDY_CLIENT_SECRET~g" $MOPIDY_CONF
fi

exec "$@"
