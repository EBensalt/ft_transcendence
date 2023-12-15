import React from 'react';
import { Box, Button, Group } from '@mantine/core';
import ChangeAvatar from './UpdateAvatar';
import ChangeName from './ChangeName';
import EnableTowFactor from '../EnableTowFactor';
import Header from '../../../../Layout/Header/Header';

function EditeProfile({setAvatar, avatar} : {setAvatar: Function, avatar: string}) {

    return (
        <div>
            <Header avatar={avatar}/>
            <Box maw={340} mx="auto">
                <ChangeAvatar settAvatar={setAvatar} avatar={avatar} />
                <ChangeName/>
                <EnableTowFactor/>
                {/* <Group justify="flex-end" mt="md">
                <Button type="button" onClick={handleClick}>Save Changs</Button>
                </Group> */}
            </Box>
        </div>
  );
}

export default EditeProfile