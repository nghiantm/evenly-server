import { Box, Text, Image, Button, DialogTrigger } from "@chakra-ui/react";

const GroupBanner: React.FC<GroupBannerProps> = ({ name, description, imageUrl, members, onOpen }) => {
  return (
    <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} fontFamily={"Lato, sans-serif;"} backgroundColor={"#222426"} py={2} px={3} borderBottomWidth={"2px"} borderColor={"#3a3e41"}>
        <Box display={"flex"} alignItems={"center"}>
            <Image
            src={"https://s3.amazonaws.com/splitwise/uploads/group/default_avatars/avatar-ruby25-other-100px.png"}
            alt={name}
            borderRadius="full"
            boxSize="46px"
            />

            <Box ml={2}>
                <Text fontSize="2xl" fontWeight="bold" color={"c8c3bc"}>
                    {name}
                </Text>
                <Text fontSize="sm" color="#9d9488">
                    {members.length} people
                </Text>
            </Box>
        </Box>
        
        <Box>
            <DialogTrigger asChild>
                <Button
                    size={"lg"}
                    mr={2}
                    color={"#e8e6e3"}
                    backgroundColor={"#b02e00"}
                    _hover={{
                        backgroundColor: "#BF3100"
                    }}
                    onClick={onOpen} // Call the function to open the dialog
                >
                    Add expense
                </Button>
            </DialogTrigger>

            <Button
                size={"lg"}
                color={"#e8e6e3"}
                backgroundColor={"#308875"}
                _hover={{
                    backgroundColor: "#34937F"
                }}
            >
                Settle up
            </Button>
        </Box>
    </Box>
  );
};

interface GroupBannerProps {
  name: string;
  description: string;
  imageUrl?: string; // Optional, in case no image is provided
  members: string[];
    onOpen: () => void; // Function to open the dialog
}

export default GroupBanner;