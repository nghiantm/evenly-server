import { useAuth0 } from "@auth0/auth0-react";
import { Portal, DialogBackdrop, DialogPositioner, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter, DialogActionTrigger, Button, DialogCloseTrigger, CloseButton, Text, Box, Image, Input, InputGroup, SelectRoot, SelectHiddenSelect, SelectLabel, SelectControl, SelectTrigger, SelectValueText, SelectIndicatorGroup, SelectIndicator, createListCollection, SelectPositioner, SelectContent, SelectItem } from "@chakra-ui/react";
import React, { useRef, useState } from "react";

const AddExpenseDialog: React.FC<AddExpenseDialogProps> = ({ groupName, members }) => {
    const contentRef = useRef<HTMLDivElement>(null)
    const { user } = useAuth0();
    const collection = createListCollection(createMailCollection(members));

    const [selectedMethod, setSelectedMethod] = useState(["equal"]);
    
    const [amount, setAmount] = useState("");
    const costPerPerson =
      amount && members.length > 0 && !isNaN(parseFloat(amount))
        ? (parseFloat(amount) / members.length).toFixed(2)
        : "0.00";

    return (
        <Portal>
            <DialogBackdrop />
            <DialogPositioner>
            <DialogContent ref={contentRef}>
                <DialogHeader backgroundColor="#308775" alignItems={"center"} display="flex" justifyContent="space-between" py="1">
                    <DialogTitle>Add an expense</DialogTitle>

                    <DialogCloseTrigger asChild position={"static"}>
                        <CloseButton size="md" bgColor="transparent" />
                    </DialogCloseTrigger>
                </DialogHeader>

                <DialogHeader display={"flex"} alignItems={"center"} py={2} borderBottomWidth={"1px"} borderColor={"#3a3e41"}>
                    With you and: 
                    <Text borderWidth={"1px"} rounded={"4xl"} px={2} py={1/2}>
                        {groupName}    
                    </Text>
                </DialogHeader>
                
                <DialogBody>
                    <Box display={"flex"}>
                        <Image
                            src={"https://s3.amazonaws.com/splitwise/uploads/category/icon/square_v2/uncategorized/general@2x.png"}
                            alt={groupName}
                            rounded={"sm"}
                            boxSize="64px"
                            mr={4}
                            my={2}
                        />
                        <Box>
                            <Input 
                                placeholder="Enter a description"
                                variant={"flushed"}
                                required={true}
                            />

                            <InputGroup startElement="$" endElement="USD">
                                <Input 
                                    variant={"flushed"}
                                    placeholder="0.00"
                                    required={true}
                                    value={amount} // Bind the input to the state
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </InputGroup>
                        </Box>
                    </Box>

                    <Box display={"flex"} justifyContent={"center"} alignItems={"center"} mt={4}>
                        <Text mr={2}>
                            Paid by 
                        </Text>
                        <SelectRoot collection={collection} multiple={false} size={"xs"} width={"40%"} defaultValue={[user?.email ?? ""]}>
                            <SelectHiddenSelect />
                            <SelectControl>
                                <SelectTrigger>
                                    <SelectValueText placeholder="you"/>
                                </SelectTrigger>
                                <SelectIndicatorGroup>
                                    <SelectIndicator />
                                </SelectIndicatorGroup>
                            </SelectControl>

                            <Portal container={contentRef}>
                                <SelectPositioner>
                                    <SelectContent>
                                        {
                                            collection.items.map((item) => (
                                                <SelectItem item={item} key={item.value}>
                                                    {item.label}
                                                </SelectItem>
                                            ))
                                        }
                                    </SelectContent>
                                </SelectPositioner>
                            </Portal>
                        </SelectRoot>
                    </Box>

                    <Box display={"flex"} justifyContent={"center"} alignItems={"center"} mt={2}>
                        <Text mr={2}>
                            Split method
                        </Text>
                        <SelectRoot 
                            collection={methodCollection}
                            size={"xs"} width={"40%"} 
                            defaultValue={["equal"]}
                            onValueChange={(item) => setSelectedMethod(item.value)}
                        >
                            <SelectHiddenSelect />
                            <SelectControl>
                                <SelectTrigger>
                                    <SelectValueText placeholder="you" />
                                </SelectTrigger>
                                <SelectIndicatorGroup>
                                    <SelectIndicator />
                                </SelectIndicatorGroup>
                            </SelectControl>

                            <Portal container={contentRef}>
                                <SelectPositioner>
                                    <SelectContent>
                                        {
                                            methodCollection.items.map((item) => (
                                                <SelectItem item={item} key={item.value}>
                                                    {item.label}
                                                </SelectItem>
                                            ))
                                        }
                                    </SelectContent>
                                </SelectPositioner>
                            </Portal>
                        </SelectRoot>
                    </Box>

                    {/* Conditionally Render Content Based on Selected Method */}
                    <Box mt={1} textAlign={"center"}>
                    {selectedMethod[0] === "equal" && (
                        <Box textAlign={"center"}>
                            <Text fontWeight="semibold">Cost per person: ${costPerPerson}</Text>
                        </Box>
                    )}
                    {selectedMethod[0] === "percentage" && (
                        <Text>Percentage coming.</Text>
                    )}
                    {selectedMethod[0] === "exact_amount" && (
                        <Text>Splitting coming.</Text>
                    )}
                    </Box>
                </DialogBody>

                <DialogFooter>
                        <DialogActionTrigger asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogActionTrigger>
                    <Button>Save</Button>
                </DialogFooter>
                
            </DialogContent>
            </DialogPositioner>
        </Portal>
    )
}

interface AddExpenseDialogProps {
    groupName: string;
    members: string[];
}

const createMailCollection = (emails: string[]) => {
    return {
        items: emails.map((email) => ({
            label: email.split("@")[0], // Extract the part before the @
            value: email, // Use the full email as the value
        })),
    };
};

const methodCollection = createListCollection({
    items: [
        { label: "Equal", value: "equal" },
        { label: "Percentage", value: "percentage" },
        { label: "Exact Amount", value: "exact_amount" },
    ]
});

export default AddExpenseDialog;