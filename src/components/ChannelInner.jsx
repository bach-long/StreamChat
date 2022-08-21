import React, { useEffect, useState, useLayoutEffect } from 'react';
import { MessageList, MessageInput, Thread, Window, useChannelActionContext, Avatar, useChannelStateContext, useChatContext } from 'stream-chat-react';
import { uuidv4 } from '@firebase/util';
import  ChannelInfo from '../assets/ChannelInfo.js';
import  Videocall  from '../assets/videocall.png';
import VideoCall from './VideoCall.jsx';
import AgoraRTC from "agora-rtc-sdk-ng";
import {AgoraVideoPlayer} from 'agora-rtc-react';
import {OtherUsers} from './';
import { connectStorageEmulator } from 'firebase/storage';

export const GiphyContext = React.createContext({});

const ChannelInner = ({ setIsEditing }) => {
  const [giphyState, setGiphyState] = useState(false);
  const [videoRoom, setVideoRoom] = useState([]);
  const { sendMessage } = useChannelActionContext();
  const {client} = useChatContext();
  const [inCall, setInCall] = useState(false);
  const [users, setUsers] = useState([]);

  const overrideSubmitHandler = (message) => {
    let updatedMessage = {
      attachments: message.attachments,
      mentioned_users: message.mentioned_users,
      parent_id: message.parent?.id,
      parent: message.parent,
      text: message.text,
    };
    
    if (giphyState) {
      updatedMessage = { ...updatedMessage, text: `/giphy ${message.text}` };
    }
    
    if (sendMessage) {
      sendMessage(updatedMessage);
      setGiphyState(false);
    }
  };
  //console.log(users);
  //console.log(videoRoom);
  return (
    (inCall ?
    <div>
      <AgoraVideoPlayer className='vid' videoTrack={videoRoom[0]} 
      style={{height: `${100/(1 + users.length)}vh`, width: `${100/(1 + users.length)}vw`}}/>
      <OtherUsers users={users} videoRoom={videoRoom}/> 
    </div> 
    : 
    <GiphyContext.Provider value={{ giphyState, setGiphyState }}>
    <div style={{ display: 'flex', width: '100%' }}>
      <Window>
        <TeamChannelHeader setIsEditing={setIsEditing} setVideoRoom={setVideoRoom} videoRoom={videoRoom} client={client} setInCall={setInCall} users={users} setUsers={setUsers}/>
        <MessageList />
        <MessageInput overrideSubmitHandler={overrideSubmitHandler} />
      </Window>
      <Thread />
    </div>
  </GiphyContext.Provider>)
  );
};

const TeamChannelHeader = ({ setIsEditing, setVideoRoom, videoRoom, client, setInCall, users, setUsers }) => {
    const { channel, watcher_count } = useChannelStateContext();
    const [members, setMembers] = useState([]);
    useLayoutEffect(()=>{
      const members = Object.values(channel.state.members).filter(({ user }) => user.id !== client.userID);
      setMembers(members);
    }, [])
    //const { client } = useChatContext();
    //console.log(channel);

    const vidCall = async (e) => {
      let response
      if(channel.call){
        response = await channel.getCallToken({
          id: channel.data.call.id
        });
      } else {
        response = await channel.createCall({
          id: `${channel.cid}`,
          type: "video"
        });
        //channel.updatePartial({set:{call : response.call}});
      }
      
      console.log(response);
      let rtc = {
        localAudioTrack: null,
        localVideoTrack: null,
        client: null,
      };
      
      let options = {
        // Pass your App ID here.
        appId: response.agora_app_id,
        // Set the channel name.
        channel: response.call.agora.channel,
        // Pass your temp token here.
        token: response.token,
        // Set the user ID.
        uid: response.agora_uid,
      };

      rtc.client = AgoraRTC.createClient({mode: "rtc", codec: "vp8"});

      rtc.client.on("user-published", async (user, mediaType) => {
        // Subscribe to the remote user when the SDK triggers the "user-published" event
        setUsers((prevUsers) => {
          return [...prevUsers, user];
        });
        console.log(user);
        await rtc.client.subscribe(user, mediaType);
        console.log("subscribe success");

        // If the remote user publishes a video track.
        user.audioTrack?.play();
        console.log('new user');

        // Listen for the "user-unpublished" event
        rtc.client.on("user-unpublished", (user, type) => {
            // Get the dynamically created DIV container.
            if(type=='audio') {
              user.audioTrack?.stop();
            }
            if(type=='video') {
              setUsers((prevUsers) => {
                return prevUsers.filter((User) => User.uid !== user.uid);
              });
            }
        });
    });

      await rtc.client.join(options.appId, options.channel, options.token, options.uid);
      // Create a local audio track from the audio sampled by a microphone.
      rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      // Create a local video track from the video captured by a camera.
      rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
      // Publish the local audio and video tracks to the RTC channel.
      await rtc.client.publish([rtc.localAudioTrack, rtc.localVideoTrack]);
      rtc.localAudioTrack.play();
      // Dynamically create a container in the form of a DIV element for playing the local video track.
      setVideoRoom([rtc.localVideoTrack, rtc.localAudioTrack]);
      setInCall(true);
    }
    const MessagingHeader = () => {
      //const members = Object.values(channel.state.members).filter(({ user }) => user.id !== client.userID);
      const additionalMembers = members.length - 3;
  
      if(channel.type === 'messaging') {
        return (
          <div className='team-channel-header__name-wrapper'>
            {members.map(({ user }, i) => (
              <div key={i} className='team-channel-header__name-multi'>
                <Avatar image={user.image} name={user.name || user.id} size={32} />
                <p className='team-channel-header__name user'>{user.name || user.id}</p>
              </div>
            ))}
  
            {additionalMembers > 0 && <p className='team-channel-header__name user'>and {additionalMembers} more</p>}
          </div>
        );
      }
  
      return (
        <div className='team-channel-header__channel-wrapper'>
          <p className='team-channel-header__name'># {channel.data.name}</p>
          <span style={{ display: 'flex' }} onClick={() => setIsEditing(true)}>
            <ChannelInfo />
          </span>
        </div>
      );
    };
  
    const getWatcherText = (watchers) => {
      if (!watchers) return 'No users online';
      if (watchers === 1) return '1 user online';
      return `${watchers} users online`;
    };
  
    return (
      <div className='team-channel-header__container'>
        <MessagingHeader />
        <div className='team-channel-header__right'>
          <img src={Videocall} style={{width: '30px', margin: '20px', cursor: 'pointer'}} onClick={vidCall} alt="" />
          <p className='team-channel-header__right-text'>{getWatcherText(watcher_count)}</p>
        </div>
      </div>
    );
  };

  export default ChannelInner;