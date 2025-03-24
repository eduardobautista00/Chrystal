import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  statsContainer: {
    position: 'absolute',
    top: 200,
    zIndex: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 50,
    backgroundColor: '#ECEAFF',
    alignSelf: 'center',
    alignItems: 'center',
    width: '90%',
    height: 75,
    borderColor: '#7B61FF',
    borderStyle: 'dashed',
    borderWidth: 1.5,
  },
  stat: {
    alignItems: 'center',
    //borderWidth: 1,
  },
  statNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    //width: '100%',
    justifyContent: 'space-between',
    //borderWidth: 1,
    //borderWidth: 1,
  },
  statNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    //width: '100%',
    justifyContent: 'space-between',
    //borderWidth: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    //marginHorizontal: 5,
  },
  loadingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  statLabel: {
    fontSize: 18,
    color: '#7F8CA1',
    fontWeight: 'regular',
  },
  statIcon: {
    marginHorizontal: 3,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  statIcon: {
    marginHorizontal: 3,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
  },
});

export default styles;
