import logo from './logo.svg';
import './App.css';
import 'stream-chat-react/dist/css/index.css'
import {StreamChat} from 'stream-chat';
import {Chat} from 'stream-chat-react';
import Cookie from 'universal-cookie';

import {ChannelListContainer, ChannelContainer, Auth} from './components'
import { useState } from 'react';

const cookies = new Cookie()

const apiKey = 'psjrbyrtdw8v';
const client = StreamChat.getInstance(apiKey);
const AuthToken = cookies.get('token');

if(AuthToken) {
  client.connectUser({
    id: cookies.get('userId'),
    name: cookies.get('username'),
    image: cookies.get('avatarURL'),
    hashedPassword: cookies.get('hashedPassword'),
    phoneNumber: cookies.get('phoneNumber'),
  }, AuthToken);
}

function App() {

  const [createType, setCreateType]= useState('');
  const [isCreating, setIsCreating]= useState('');
  const [isEditing, setIsEditing]= useState('');
  const [On, setOn] = useState(false);

  if(!AuthToken) return <Auth/> 
  return (
    <div className="app__wrapper">
      <Chat client={client} theme='team light'>
         <ChannelListContainer
         isCreating = {isCreating}
         setCreateType = {setCreateType}
         setIsCreating = {setIsCreating}
         setIsEditing = {setIsEditing} 
         On = {On}
         setOn = {setOn}
        />
         <ChannelContainer
         isCreating = {isCreating}
         isEditing = {isEditing}
         setIsCreating = {setIsCreating}
         setIsEditing = {setIsEditing} 
         createType = {createType} 
         />
      </Chat>
    </div>
  );
}

export default App;
