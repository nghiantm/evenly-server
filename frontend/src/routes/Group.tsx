import { Navigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { Box, Text, DialogRoot, useDisclosure } from "@chakra-ui/react";
import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { clearGroupExpenses, fetchGroupExpenses } from "../redux/slices/groupSlice";
import AddExpenseDialog from "../components/group/AddExpenseDialog";
import GroupBanner from "../components/group/GroupBanner";

const Group = () => {
    const dispatch: AppDispatch = useDispatch();
    const { user, getAccessTokenSilently } = useAuth0();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { groupId } = useParams<{ groupId: string }>(); // Extract groupId from the URL
    const { groups, currentGroupExpense, isLoading, error } = useSelector((state: RootState) => state.group); // Access groups from Redux state

    // Find the group by ID
    console.log(user);
    const group = groups.find((g) => g.id === groupId);
    if (!group) {
        return <Navigate to="/dashboard" replace />;
    }
    console.log(group);

    useEffect(() => {
        dispatch(clearGroupExpenses()); // Clear previous group expenses when component mounts
        const fetchData = async () => {
            try {
                const token = await getAccessTokenSilently();
                dispatch(fetchGroupExpenses({ token, groupId: group.id }));
            } catch (err) {
                console.error("Error fetching access token:", err);
            }
        }

        fetchData();
    }, [dispatch, groupId])

    return (
    <Box boxShadow="sm" borderWidth={"1px"} borderColor={"#3a3e41"}>
        <DialogRoot open={isOpen} onEscapeKeyDown={onClose} onInteractOutside={onClose} placement="center">
            <GroupBanner
                name={group.name}
                description={group.description}
                imageUrl={group.imageUrl}
                members={group.members}
                onOpen={onOpen}
            />

            <AddExpenseDialog groupName={group.name ? group.name : "Test Group"} members={group.members}/>
        </DialogRoot>
        <Box>
            {isLoading && <Text>Loading expenses...</Text>}
            {error && <Text color="red.500">Error: {error}</Text>}

            {currentGroupExpense.length === 0 && !isLoading && (
            <Text>No expenses found for this group.</Text>
            )}

            {currentGroupExpense.map((expense) => (
                <Box
                    key={expense.id}
                    p={2}
                    borderBottomWidth="1px"
                    borderColor={"#3a3e41"}
                >
                    <Box display={"flex"} alignItems={"center"}>
                        <Box display={"flex"} flexDir={"column"} alignItems={"center"} pr={2}>
                            <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" color="#a8a095" mb="-1">
                            {formatDate(expense.createdDate).split(" ")[0]} {/* Month */}
                            </Text>
                            <Text fontSize="lg" color="#a8a095">
                                {formatDate(expense.createdDate).split(" ")[1]} {/* Day */}
                            </Text>
                        </Box>

                        <img src="https://s3.amazonaws.com/splitwise/uploads/category/icon/square_v2/uncategorized/general@2x.png" width={"35"}/>
                        
                        
                        <Text flex="1" fontWeight={"medium"} ml="2" color={"#c8c3bc"}>{expense.description ? expense.description : "No Name"}</Text>
                        
                        <Box display="flex" flexDir="column" textAlign="right" fontSize="xs" mr="3">
                            {user?.email === expense.paidBy && (
                                <Text>you paid</Text>
                            )}

                            {user?.email !== expense.paidBy && (
                                <Text>{truncateText(expense.paidBy.split("@")[0], 8)} paid</Text>
                            )}

                            <Text fontSize="md" fontWeight="semibold">
                                ${expense.amount.toFixed(2)}
                            </Text>
                        </Box>

                        <Box display="flex" flexDir="column" fontSize="xs" minWidth="105px">
                            {user?.email === expense.paidBy && (
                                <>
                                    <Text>you lent</Text>
                                    <Text color="#67c9ad" fontSize="md" fontWeight="semibold">
                                        ${calculateLentAmount(expense.shares, expense.paidBy).toFixed(2)}
                                    </Text>
                                </>
                            )} 

                            {user?.email !== expense.paidBy && isMyEmailInShares(expense.shares, user?.email) && (
                                <>
                                    <Text>{truncateText(expense.paidBy.split("@")[0], 8)} lent</Text>
                                    <Text color="#ff6d3a" fontSize="md" fontWeight="semibold">
                                        ${calculateLentAmount(expense.shares, expense.paidBy).toFixed(2)}
                                    </Text>
                                </>
                            )} 

                            {user?.email !== expense.paidBy && !isMyEmailInShares(expense.shares, user?.email) && (
                                <>
                                    <Text>not</Text>
                                    <Box h="24px" alignContent="center">
                                        <Text>
                                            involved
                                        </Text>
                                    </Box>
                                </>
                            )}
                        </Box>
                    </Box>
                </Box>
            ))}
        </Box>
    </Box>
  );
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short", // Short month name (e.g., "May")
    day: "numeric", // Day of the month (e.g., "10")
  });
};

const calculateLentAmount = (shares: { amount: number; userId: string }[], myEmail: string): number => {
  return shares
    .filter((share) => share.userId !== myEmail) // Exclude your own shares
    .reduce((total, share) => total + share.amount, 0); // Sum up the amounts
};

const isMyEmailInShares = (shares: { amount: number; userId: string }[], myEmail: string | undefined): boolean => {
  return shares.some((share) => share.userId === myEmail);
};

const truncateText = (text: string, maxLength: number): string => {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + "..";
  }
  return text;
};

export default Group;