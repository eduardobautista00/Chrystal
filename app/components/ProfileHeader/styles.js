import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    justifyContent: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 100,
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'semibold',
    color: '#000',
  },
  company: {
    fontSize: 18,
    color: '#fff',
    marginTop: 5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  icon: {
    marginRight: 8,
  },
  address: {
    fontSize: 12,
    color: '#fff',
    marginTop: 5,

  },
  phone: {
    fontSize: 12,
    color: '#fff',
    marginTop: 5,

  },
});

export default styles;
