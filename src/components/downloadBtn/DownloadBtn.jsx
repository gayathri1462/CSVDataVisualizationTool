import { DownloadOutlined } from "@ant-design/icons";
import { Button } from "antd";

const DownloadBtn = ({ handleDownload, text, size }) => {
  return (
    <Button
      type="primary"
      icon={<DownloadOutlined />}
      size={size}
      onClick={handleDownload}
    >
      {text}
    </Button>
  );
};

export default DownloadBtn;
