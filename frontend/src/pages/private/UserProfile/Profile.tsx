import React, { useEffect, useState } from 'react'
import {Button, Container, Group, LoadingOverlay, ScrollArea, SimpleGrid, Text, Title} from '@mantine/core'
import UserCard  from './ProfileInfo/UserCard'
import MatchHistory from './MatchHistory/MatchHistory'
import Achievements from './Achievements/Achievement'
import Header from '../../../Layout/Header/Header'
import Footer from '../../../Layout/Footer/Footer'
import axios from 'axios'
import { Link } from 'react-router-dom'

export function ProfileSections({handleRequest, friendShip}: {handleRequest: any, friendShip: string}) {
    const name = window.location.pathname.split("/")[1];  // get the name from the url use this and remove the userName from the props and cookies storage
    const [profile, setProfile] = useState<any>(null);
    const [notFound, setNotFound] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        // console.log("name: in public profile fitcheng data", name);
        const getUserProfile = async () => {
            await axios.get("http://localhost:3001/user/profile", {params: {name: name}})
            .then((res) => {
                if (res.status === 200) {
                    setProfile(res.data);
                    console.log("user profile: ", res.data);
                    setIsLoading(false);
                }
            })
            .catch((err) => {
                if (err.response.status === 404) {
                    setNotFound(true);
                    setIsLoading(false);
                }
                console.error("error when send get request to get user profile: ", err);
            })
        };
        getUserProfile();
    }, []);

    if (isLoading)
        return (
            <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
        );

    if (notFound)
        return (
            <Container  mb={200} m={200}>
                <Title ta='center' m={5} size='xl' >User not found</Title>
                <Text size='xl' bg='red' ta='center' className='rounded-md' >404</Text>
            </Container>
        );
    return (
      <div>
        <SimpleGrid
              cols={{ base: 1, sm: 1, lg: 2 }}
              spacing={{ base: 10, sm: 'xl', lg: 'xl' }}
              verticalSpacing={{ base: 'xl', sm: 'xl', lg: 'xl' }}
        >
          <UserCard usercard={profile?.usercard} handleRequest={handleRequest} friendShip={friendShip} />
          {/* <UserCard userName={profile?.username} avatar={profile?.avatar} level={profile?.level} win={5} losses={6} /> */}
          <Achievements achievement={profile?.achievements} />
          <MatchHistory matchhistory={profile?.matchhistory}/>
        </SimpleGrid>
      </div>
    );
}

function Profile({handleRequest, friendShip}: {handleRequest: any, friendShip: string}) {

    return (
        // <div  className='h-full ml-8 mr-8 pr-8 pl-8 '>
            <div>
            {/* <Header avatar={avatar}/> */}
             <div className=' ml-4 mr-4 pr-4 pl-4 mb-8 pb-8'> 
                <ProfileSections handleRequest={handleRequest} friendShip={friendShip}/>
             </div> 
            <Footer/>
        </div>
    );
}

export default Profile