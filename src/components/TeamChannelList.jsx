import React from 'react'
import { AddChannel } from '../assets/AddChannel.js'

const TeamChannelList = ({children, error=false, loading, type, isCreating, setCreateType, setIsCreating, setIsEditing, setToggleContainer}) => {
    if (error) {
        return type === 'team' ? (
            <div className='team-channel-list'>
                <p className='team-channel-list__message'>
                    Connection error
                </p>
            </div>
        ) : null
    }

    if(loading) {
        return (
            <div className='team-channel-list'>
                <p className='team-channel-list__message loading'>
                    {type === 'team'? 'Channels' : 'Messages'} Loadding ....
                </p>
            </div>
        )
    }
  return (
    <div className='team-channel-list'>
        <div className='team-channel-list__header'>
            <p className='team-channel-list__header__title'>
                {type === 'team' ? 'Channels' : 'Direct Message'}
            </p>
            <AddChannel 
                isCreating = {isCreating}
                setCreateType = {setCreateType}
                setIsCreating = {setIsCreating}
                setIsEditing = {setIsEditing}
                setToggleContainer={setToggleContainer}
                type = {type === 'team' ? 'team' : 'messaging'}
            />
        </div>
        {children}
    </div>
  )
  
}

export default TeamChannelList