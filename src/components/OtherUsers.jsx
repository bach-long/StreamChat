import React from 'react'
import {AgoraVideoPlayer} from 'agora-rtc-react';

const OtherUsers = ({users}) => {

  return (
    <div>
    {users.length!=0 && users.map((user)=>(<AgoraVideoPlayer className='vid' videoTrack={user.videoTrack} style={{height: `${100/(1 + users.length)}vh`, 
    width: `${100/(1 + users.length)}vw`}}/>))}
    </div>
  )
}

export default OtherUsers;