## Create React App Visualization

This assessment was bespoke handcrafted for Luis Perez.

Read more about this assessment [here](https://react.eogresources.com)

### Features Implemented
1. Fetch metrics through metrics query and store them into metrics context for later use in different components
2. Show metrics select box and make update to selected metrics in metrics context for measurements chart and cards updated based on selected metrics
3. Configure ApolloProvider to make it work with graphql subscription
4. Fetch measurements info through newMeasurement subscription and store into measurements context for the metrics stored in metrics context 
5. Show measurements card based on measurements context values
6. Fetch measurements history data inside useEffect hook on selected metrics change
7. Show line chart for the measurements history fetched. In this case, showed only those ones with unit 'PSI' since it could be not ideal to show data with different unit in one chart
8. Show line charts for each units

### Screenshot of example
![image](https://user-images.githubusercontent.com/97510989/156866062-abc1de3c-d95e-416e-a4ec-ca1b45f53451.png)
