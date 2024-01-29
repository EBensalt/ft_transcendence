import React from "react";
import { Card, Group, HoverCard, Image, Text } from "@mantine/core";
import OneAchievementInterface from "./OneAchievementInterface";
import firstGameImage from "./assite/firstGame.png"
import firstFriendImage from "./assite/firstFriend.png"

import lead1Image from "./assite/lead1.png"
import lead2Image from "./assite/lead2.png"
import lead3Image from "./assite/lead3.png"

function AchievementCards({type, image, title, name}: OneAchievementInterface) {

    if (name === "firstMatch") {
        image = firstGameImage;
    } else if (name === "firstFriend") {
        image = firstFriendImage;
    } 
    else if (name === "lead1") {
        image = lead1Image;
    } else if (name === "lead2") {
        image = lead2Image;
    } else if (name === "lead3") {
        image = lead3Image;
    }

    return (
       <div onTouchMove={() => console.log("test")} className='inline-block w-[100px] h-full mt-4'>
            <Group justify="center">
                <HoverCard width={200} openDelay={500}>
                    <HoverCard.Target>
                        <Card shadow="sm" padding="mg" radius="md" withBorder>
                            <Card.Section>
                                {type ?
                                    <Image
                                        src={image}
                                        height={300}
                                        alt="Norway"
                                    /> :
                                    <Image className="blur-sm"
                                    src={image}
                                        height={300}
                                        alt="Norway"
                                    />
                                }
                            </Card.Section>
                        </Card>
                    </HoverCard.Target>
                    <HoverCard.Dropdown>
                        <Text size="lg" ta='center'>{title}</Text>
                    </HoverCard.Dropdown>
                </HoverCard>
            </Group>
        </div>
    );
}

export default AchievementCards