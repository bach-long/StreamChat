import React, { useState } from 'react'
import { useChatContext } from 'stream-chat-react'
import {UserList} from './'
import {CloseCreateChannel} from '../assets/CloseCreateChannel.js';

const ChannelNameInput = ({channelName = '', setChannelName}) => {
  const handleChange=(e)=>{
    e.preventDefault();
    setChannelName(e.target.value);
    //console.log();
  }

  return (
    <div className="channel-name-input__wrapper">
      <p>Name</p>
      <input value={channelName} onChange={handleChange} placeholder="channel name"/>
      <p>Add Member</p>
    </div>
  )
}

const CreateChannel = ({createType, setIsCreating}) => {
  const [channelName, setChannelName] = useState('');
  const {client, setActiveChannel} = useChatContext();
  const [selectedUsers, setSelectedUsers] = useState([client.userID || '']);

  const createChannel = async (e) => {
    e.preventDefault();
    try{
      const newChannel = await client.channel(createType, channelName.replace(' ', '_').trim(), {
        name: channelName,
        members: selectedUsers
      })

      await newChannel.watch();
      setChannelName('');
      setIsCreating(false);
      setSelectedUsers([client.userID]);
      setActiveChannel(newChannel);
    }catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="create-channel__container">
      <div className="create-channel__header">
        <p>{createType === 'team' ? 'Create a new channel' : 'Directly send a message'}</p>
        <CloseCreateChannel setIsCreating={setIsCreating}/>
      </div>
      {createType === 'team' && <ChannelNameInput channelName={channelName} setChannelName={setChannelName}/>}
      <UserList setSelectedUsers={setSelectedUsers} selectedUsers={selectedUsers}/>
      <div className='create-channel__button-wrapper' onClick={createChannel}>
        <p>{createType==='team'? 'Create Channel': 'Create Message Group'}</p>
      </div>
    </div>
  )
}

export default CreateChannel