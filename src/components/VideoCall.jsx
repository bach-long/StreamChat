import React from 'react'
import AgoraRTC from "agora-rtc-sdk-ng";

const VideoCall = ({videoRoom, setVideoRoom, client}) => {
  const cameraVideoProfile = '480_4'; // 640 × 480 @ 30fps  & 750kbs
  const screenVideoProfile = '480_2'; // 640 × 480 @ 30fps
  let rtc = {
    localAudioTrack: null,
    localVideoTrack: null,
    client: null,
  };

  rtc.client = AgoraRTC.createClient({mode: "rtc", codec: "vp8"});
  
  let options = {
    // Pass your App ID here.
    appId: process.env.Agora_App_Id,
    // Set the channel name.
    channel: videoRoom?.call.agora.channel,
    // Pass your temp token here.
    token: videoRoom?.token,
    // Set the user ID.
    uid: 123456,
  };



  return (
    <div className="row">
            <div>
              <button>START</button>
            </div>
        </div>
  )
}

export default VideoCall;