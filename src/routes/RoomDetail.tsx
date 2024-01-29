import {
    Avatar,
    Box,
    Container,
    Grid,
    GridItem,
    Heading,
    HStack,
    Image,
    Skeleton,
    Text,
    VStack,
} from "@chakra-ui/react";
import { FaStar } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getRoom, getRoomReviews } from "../api";
import { IReview, IRoomDetail } from "../types";
// import { setConstantValue } from "typescript";

export default function RoomDetail() {
    //useParmas brings all parameters of URL
    //roomPk from router.tsx
    const { roomPk } = useParams();
    const { isLoading, data } = useQuery<IRoomDetail>(
        [`rooms`, roomPk],
        getRoom
    );
    const { data: reviewsData } = useQuery<IReview[]>(
        [`rooms`, roomPk, `reviews`],
        getRoomReviews
    );
    return (
        <Box
            pb={40}
            mt={10}
            px={{
                base: 10,
                lg: 40,
            }}
        >
            <Skeleton height={"43px"} width="25%" isLoaded={!isLoading}>
                <Heading>{data?.name}</Heading>
            </Skeleton>
            <Grid
                mt={12}
                rounded="xl"
                overflow={"hidden"}
                gap={2}
                height="60vh"
                templateRows={"1fr 1fr"}
                templateColumns={"repeat(4, 1fr)"}
            >
                {/* Creates 5 gird items */}
                {[0, 1, 2, 3, 4].map((index) => (
                    <GridItem
                        //if it's the first photo, takes 2 cols
                        //if not, 1.
                        colSpan={index === 0 ? 2 : 1}
                        rowSpan={index === 0 ? 2 : 1}
                        overflow={"hidden"}
                        key={index}
                    >
                        {/* Inside grids, fill in photos */}
                        <Skeleton isLoaded={!isLoading} h="100%" w="100%">
                            <Image
                                _hover={{
                                    transform: `scale(1.5)`,
                                }}
                                objectFit={"cover"}
                                w="100%"
                                h="100%"
                                src={data?.photos[index]?.file}
                            />
                        </Skeleton>
                    </GridItem>
                ))}
            </Grid>

            <HStack width={"40%"} justifyContent={"space-between"} mt={10}>
                <VStack alignItems={"flex-start"}>
                    <Skeleton isLoaded={!isLoading} height={"30px"}>
                        <Heading fontSize={"xl"}>
                            House hosted by {data?.owner.name}
                        </Heading>
                    </Skeleton>
                    <Skeleton isLoaded={!isLoading} height={"30px"}>
                        <HStack justifyContent={"flex-start"} w="100%">
                            <Text mt={3}>
                                {data?.toilets} toliet
                                {data?.toilets === 1 ? "" : "s"}
                            </Text>
                            <Text mt={"10px"}>∙</Text>
                            <Text mt={"10px"}>
                                {data?.rooms} room{data?.rooms === 1 ? "" : "s"}
                            </Text>
                        </HStack>
                    </Skeleton>
                </VStack>
                <Avatar
                    name={data?.owner.name}
                    size={"xl"}
                    src={data?.owner.avatar}
                />
            </HStack>

            <Box mt={10}>
                <Heading mb={5} fontSize={"2xl"}>
                    <HStack>
                        <FaStar /> <Text>{data?.rating}</Text>
                        <Text>∙</Text>
                        <Text>
                            {/* using length beacuase it is an array */}
                            {reviewsData?.length} review
                            {reviewsData?.length === 1 ? "" : "s"}
                        </Text>
                    </HStack>
                </Heading>

                <Container mt={16} maxW="container.lg" marginX="none">
                    <Grid gap={10} templateColumns={"1fr 1fr"}>
                        {reviewsData?.map((review, index) => (
                            <VStack alignItems={"flex-start"} key={index}>
                                <HStack>
                                    <Avatar
                                        name={review.user.name}
                                        src={review.user.avatar}
                                        size="md"
                                    />
                                    <VStack
                                        spacing={0}
                                        alignItems={"flex-start"}
                                    >
                                        <Heading fontSize={"md"}>
                                            {review.user.name}
                                        </Heading>
                                        <HStack spacing={1}>
                                            <FaStar size="12px" />
                                            <Text>{review.rating}</Text>
                                        </HStack>
                                    </VStack>
                                </HStack>
                                <Text>{review.payload}</Text>
                            </VStack>
                        ))}
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
}
