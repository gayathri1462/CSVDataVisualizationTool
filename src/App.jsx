import styles from "./App.module.scss";
import CustomSteps from "./screens/steps/Steps";

export default function App() {
  return (
    <div className={styles.appWrapper}>
      <div className={styles.headerSection}>
        <h1>VizCSV: Explore and Visualize Your Data</h1>
        <h3>Transform Raw CSV Data into Insightful Visualizations</h3>
      </div>
      <CustomSteps />
      <p>&copy; Developed By Gayathri Devi Nagalapuram</p>
    </div>
  );
}
