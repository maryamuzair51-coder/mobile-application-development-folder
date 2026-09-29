import { StyleSheet } from 'react-native';

const globalStyles = StyleSheet.create({

  // =========================
  // HOME SCREEN
  // =========================

  homeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },

  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 20,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 30,
  },

  // =========================
  // BUTTON
  // =========================

  button: {
    width: '100%',
    height: 55,
    backgroundColor: '#4A6CF7',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },

  buttonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: 'bold',
  },

  // =========================
  // PROFILE SCREEN
  // =========================

  profileContainer: {
  padding: 20,
  alignItems: 'center',
  backgroundColor: '#f5f7fa',
  paddingBottom: 50,
},

  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
    marginTop: 0,
    marginBottom: 15,
  },

  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 20,
    marginTop:0,

  },

  // =========================
  // INPUT
  // =========================

  label: {
    alignSelf: 'flex-start',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 6,
  },

  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    fontSize: 16,
    marginBottom: 15,
  },

  infoContainer: {
  width: '100%',
  backgroundColor: '#ffffff',
  padding: 15,
  borderRadius: 10,
  marginTop: 10,
  marginBottom: 15,
  borderWidth: 1,
  borderColor: '#dddddd',
},
  // =========================
  // LIVE INFORMATION
  // =========================

  profilePreviewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222222',
    marginTop: 20,
    marginBottom: 10,
  },

  liveText: {
    fontSize: 17,
    color: '#333333',
    marginBottom: 6,
  },

  // =========================
// SETTINGS SCREEN
// =========================

settingsContainer: {
  flex: 1,
  padding: 20,
  paddingTop: 100,
  alignItems: 'center',
},

darkModeContainer: {
  width: '100%',
  height: 75,
  paddingHorizontal: 20,
  borderRadius: 10,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 30,
  borderWidth: 1,
  borderColor: '#dddddd',
},

settingText: {
  fontSize: 20,
  fontWeight: 'bold',

},

backHomeButton: {
  width: '100%',
  height: 55,
  backgroundColor: '#4A6CF7',
  borderRadius: 10,
  justifyContent: 'center',
  alignItems: 'center',
},

backHomeButtonText: {
  color: '#ffffff',
  fontSize: 17,
  fontWeight: 'bold',
},

// =========================
// CONTACT SCREEN
// =========================

contactContainer: {
  flex: 1,
  padding: 20,
  paddingTop: 70,
  alignItems: 'center',
},

emailInputContainer: {
  width: '100%',
  height: 55,
  flexDirection: 'row',
  alignItems: 'center',
  borderWidth: 1,
  borderColor: '#cccccc',
  borderRadius: 10,
  backgroundColor: '#ffffff',
  marginBottom: 20,
},

emailIcon: {
  marginLeft: 15,
},

emailInput: {
  flex: 1,
  height: 55,
  paddingHorizontal: 12,
  fontSize: 16,
},

submitButton: {
  width: '100%',
  height: 55,
  backgroundColor: '#4A6CF7',
  borderRadius: 10,
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 15,
},

submitButtonText: {
  color: '#ffffff',
  fontSize: 17,
  fontWeight: 'bold',
},
});

export default globalStyles;