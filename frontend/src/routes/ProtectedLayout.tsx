import { Box, Container, Grid, GridItem, Text } from "@chakra-ui/react";
import { SignedIn, SignedOut, RedirectToSignIn, SignOutButton } from "@clerk/clerk-react";
import { Outlet } from "react-router"
import LeftNavBar from "../components/navigation/LeftNavBar";

const ProtectedLayout = () => {
    return (
        <>
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>

            <SignedIn>
                <Box>
                    <Box backgroundColor={"#308875"} py={1} justifyContent={"center"} display={"flex"}>
                        <Container maxW={"5xl"} display={"flex"} justifyContent={"space-between"} alignItems={"center"} mx={"2"}>
                            <Text>Evenly</Text>
                            <Text>Profile</Text>
                        </Container>
                    </Box>

                    <Box justifyContent={"center"} display={"flex"}>
                        <Container maxW={"5xl"} display={"flex"} justifyContent={"space-between"} alignItems={"center"} mx={"2"}>
                            <Grid templateColumns='repeat(5, 1fr)' width={"100%"}>
                                <GridItem colSpan={1}>
                                    <LeftNavBar />
                                </GridItem>

                                <GridItem colSpan={3}>
                                    <Outlet />
                                </GridItem>

                                <GridItem colSpan={1} backgroundColor={"purple.500"}>
                                    <SignOutButton>
                                        <button>
                                            Log Out
                                        </button>
                                    </SignOutButton>
                                </GridItem>
                            </Grid>
                        </Container>
                    </Box>
                </Box>
            </SignedIn>
        </>
    )
}

export default ProtectedLayout;
