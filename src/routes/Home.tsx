import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getRooms } from "../api";
import Room from "../components/Room";
import RoomSkeleton from "../components/RoomSkeleton";
import { IRoomList } from "../types";
import { Input, Grid, Text } from "@chakra-ui/react";

export default function Home() {
    // Set the key as "rooms" and put function getRooms
    // useQuery let us know if the getRooms function is isLoading or not,
    // and also let us know if the data is ready or not,
    // and then save that result to the cache memory, under the name "rooms"
    const { isLoading, data } = useQuery<IRoomList[]>(["rooms"], getRooms);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredRooms = data
        ? data.filter(
              (room) =>
                  room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  room.city.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : [];

    return (
        <div style={{ margin: "0 20px" }}>
            <Input
                type="text"
                placeholder="Search rooms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                mb={4}
            />
            {isLoading && <RoomSkeleton />}
            {!isLoading && filteredRooms.length === 0 && (
                <Text>No rooms found</Text>
            )}
            <Grid
                templateColumns="repeat(auto-fill, minmax(250px, 1fr))"
                // 1fr lets columns to take as many spaces as can with same size
                gap={4}
                marginTop={4}
            >
                {filteredRooms.map((room) => (
                    <Room
                        key={room.pk}
                        pk={room.pk}
                        isOwner={room.is_owner}
                        imageUrl={room.photos[0]?.file}
                        name={room.name}
                        rating={room.rating}
                        city={room.city}
                        country={room.country}
                        price={room.price}
                    />
                ))}
            </Grid>
        </div>
    );
}
