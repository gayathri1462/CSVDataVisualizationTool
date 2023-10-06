import { Dropdown, message, Button } from "antd";
import styles from "./DropDown.module.scss";
import { useState } from "react";

const DropdownButton = ({ labels, sendSelectedLabel }) => {
  const [label, setLabel] = useState("");
  const handleMenuClick = ({ key }) => {
    setLabel(options[parseInt(key)].label);
    sendSelectedLabel(options[parseInt(key)].label);
    message.info(`${options[parseInt(key)].label} is selected`);
  };

  const options = labels?.map((data, index) => ({
    label: data,
    key: index.toString()
  }));

  const menuProps = {
    items: options,
    onClick: handleMenuClick,
    selectable: true
  };

  return (
    <div>
      <Dropdown menu={menuProps} overlayClassName={styles.dropdownDiv}>
        <Button>
          {label
            ? `The label chosen to display : ${label}`
            : "Choose the label to display"}
        </Button>
      </Dropdown>
    </div>
  );
};

export default DropdownButton;
