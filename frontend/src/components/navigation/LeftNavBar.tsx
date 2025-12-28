import { Box, Input, InputGroup, Text, Button } from "@chakra-ui/react";
import { IoSearchSharp } from "react-icons/io5";
import SideButton from "../buttons/SideButton";
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { useEffect } from "react";
import { fetchGroups } from "../../redux/slices/groupSlice";

const LeftNavBar = () => {
  const { getAccessTokenSilently } = useAuth0();
  const dispatch: AppDispatch = useDispatch();
  const { groups, isLoading, error } = useSelector((state: RootState) => state.group);

  useEffect(() => {
    const fetchData = async () => {
      try {
          // Retrieve the JWT from Auth0
          const token = await getAccessTokenSilently();

          // Pass the token to your API client or Redux thunk
          dispatch(fetchGroups(token));
      } catch (err) {
          console.error("Error fetching access token:", err);
      }
    };

    fetchData();
  }, [dispatch])

  return (
    <Box mt={2}>
      <SideButton href="/dashboard" pathnameCondition="/dashboard">
        Dashboard
      </SideButton>

      <SideButton href="/dashboard/recent" pathnameCondition="/dashboard/recent">
        Recent activity
      </SideButton>

      <InputGroup startElement={<IoSearchSharp />} my={4} pl={2} pr={4}>
        <Input size={"sm"} placeholder="Filter by name" />
      </InputGroup>

      <SideButton href="/dashboard/all" pathnameCondition="/dashboard/all">
        All expenses
      </SideButton>

      <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
        <Text fontSize={"sm"}>GROUPS</Text>
        <Button
          style={{ color: "inherit", textDecoration: "none" }}
          _hover={{
            borderColor: "#308875",
          }}
          size={"sm"}
        >
          <Text fontSize={"sm"}>+ add</Text>
        </Button>
      </Box>

      {/* Display groups dynamically */}
      {isLoading && <Text>Loading groups...</Text>}
      {error && <Text color="red.500">Error: {error}</Text>}
      {groups.map((group) => (
        <SideButton key={group.id} href={`/dashboard/group/${group.id}`} pathnameCondition={`/dashboard/group/${group.id}`}>
          {group.name}
        </SideButton>
      ))}
    </Box>
  );
};

export default LeftNavBar;