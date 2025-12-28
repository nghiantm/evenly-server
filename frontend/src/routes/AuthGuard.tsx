import { useAuth0 } from "@auth0/auth0-react";
import { Box, Button, Container, Grid, GridItem, Input, InputGroup, Text } from "@chakra-ui/react";
import { Navigate, Outlet } from "react-router"
import LeftNavBar from "../components/navigation/LeftNavBar";

const AuthGuard = () => {
    const { isAuthenticated, isLoading, logout } = useAuth0();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return (
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
                        <button onClick={() => logout({ logoutParams: { returnTo: `${window.location.origin}` } })}>
                        Log Out
                        </button>
                        </GridItem>
                    </Grid>
                </Container>
            </Box>
        </Box>
    )
}

export default AuthGuard;