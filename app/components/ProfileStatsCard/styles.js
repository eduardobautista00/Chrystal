import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  statsContainer: {
    position: 'absolute',
    top: 250,
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
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  statLabel: {
    fontSize: 18,
    color: '#7F8CA1',
    fontWeight: 'regular',
  },
});

export default styles;
