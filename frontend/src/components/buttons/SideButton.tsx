import { Text } from "@chakra-ui/react";
import { Link, useLocation } from "react-router";

interface NavLinkProps {
  href: string;
  pathnameCondition: string;
  children: React.ReactNode; // Accept children as a prop
}

const SideButton: React.FC<NavLinkProps> = ({ href, pathnameCondition, children }) => {
  const location = useLocation();

  return (
    <Link to={href} style={{ color: "inherit", textDecoration: "none" }}>
      <Text
        color={location.pathname === pathnameCondition ? "#67c9ad" : "inherit"}
        fontWeight={location.pathname === pathnameCondition ? "semibold" : "medium"}
        _hover={{
          backgroundColor: "#242628",
        }}
        py={1}
        pl={2}
        borderLeftWidth={"6px"}
        borderColor={location.pathname === pathnameCondition ? "#2c7d66" : "inherit"}
      >
        {children}
      </Text>
    </Link>
  );
};

export default SideButton;