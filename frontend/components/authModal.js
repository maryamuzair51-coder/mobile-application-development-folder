
import React, { useState, useRef } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../styling/theme';

export default function AuthModal({
  visible,
  onClose,
  onLogin,
  onSignup,
  onForgotPassword,
  onGoogleLogin,
  onLoginSuccess,
}) {
  const insets = useSafeAreaInsets();

  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const scrollViewRef = useRef(null);

const scrollToTop = () => {
  requestAnimationFrame(() => {
    scrollViewRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  });
};
  const passwordChecks = [
    password.length >= 8,
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];

  const strengthScore = passwordChecks.filter(Boolean).length;

  const passwordStrength =
    password.length === 0
      ? ''
      : password.length < 8 || strengthScore <= 2
      ? 'Weak'
      : strengthScore <= 3
      ? 'Medium'
      : 'Strong';

  const strengthColor =
    passwordStrength === 'Strong'
      ? COLORS.success
      : passwordStrength === 'Medium'
      ? '#D99A25'
      : '#D64545';

  const resetFields = () => {
    setErrorMessage('');
    setSuccessMessage('');
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setAgreeToTerms(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const closeModal = () => {
    if (submitting) return;

    setIsSignup(false);
    resetFields();
    onClose?.();
  };

  const switchMode = () => {
  if (submitting) return;

  setIsSignup((previous) => !previous);
  resetFields();
  scrollToTop();
};

  
const handleSubmit = async () => {
  if (submitting) return;

  const cleanEmail = email.trim().toLowerCase();
  const signingUp = isSignup;

  if (signingUp && !name.trim()) {
    setErrorMessage('Please enter your full name.');
    scrollToTop();
    return;
  }

  if (!cleanEmail || !password) {
    setErrorMessage('Please enter your email and password.');
    scrollToTop();
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    setErrorMessage('Please enter a valid email address.');
    scrollToTop();
    return;
  }

  if (signingUp) {
    if (password.length < 8) {
      setErrorMessage(
        'Your password must contain at least 8 characters.'
      );
      scrollToTop();
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Your passwords do not match.');
      scrollToTop();
      return;
      
    }

    if (!agreeToTerms) {
      setErrorMessage(
        'Please agree to the Terms and Conditions.'
      );
      scrollToTop();
      return;
    }
  }

  const user = {
    name: name.trim(),
    email: cleanEmail,
  };

  const callback = signingUp ? onSignup : onLogin;

  if (typeof callback !== 'function') {
    setErrorMessage(
      'Authentication is not connected. Please try again.'
    );
    return;
  }

  try {
    setSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    await callback(user, password, rememberMe);

    if (signingUp) {
      // Sign-up creates the account but does NOT log the user in.
      setIsSignup(false);
      setName('');
      setPassword('');
      setConfirmPassword('');
      setAgreeToTerms(false);
      setShowPassword(false);
      setShowConfirmPassword(false);

      // Keep the email so the user can log in more easily.
      setEmail(cleanEmail);

      setSuccessMessage(
        'Account created successfully! Please log in now.'
      );
      scrollToTop();
      // Keep the modal open and wait for the user to log in.
      return;
    }

    // Only a successful LOGIN reaches this point.
    setSuccessMessage(
      'Login successful! Continuing your shopping...'
    );
    scrollToTop();

    setTimeout(() => {
      setSuccessMessage('');
      setIsSignup(false);
      resetFields();

      // Close the modal and resume the pending action.
      onLoginSuccess?.();
    }, 1000);
  } catch (error) {
    setSuccessMessage('');
    setErrorMessage(
      error?.message || 'Authentication failed. Please try again.'
    );
  } finally {
    setSubmitting(false);
  }
};


  const handleForgotPassword = () => {
    if (typeof onForgotPassword === 'function') {
      onForgotPassword(email.trim().toLowerCase());
      return;
    }

    Alert.alert(
      'Forgot Password?',
      'Password reset is not configured yet.'
    );
  };

  const handleGoogleLogin = () => {
    if (typeof onGoogleLogin === 'function') {
      onGoogleLogin();
      return;
    }

    Alert.alert(
      'Google Sign-In',
      'Google authentication is not configured yet.'
    );
  };

  const renderPasswordInput = (
    value,
    onChangeText,
    visiblePassword,
    setVisiblePassword,
    placeholder
  ) => (
    <View style={styles.inputBox}>
      <Ionicons
        name="lock-closed-outline"
        size={19}
        color={COLORS.muted}
      />

      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={COLORS.muted}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={!visiblePassword}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="done"
      />

      <TouchableOpacity
        onPress={() => setVisiblePassword((previous) => !previous)}
        accessibilityRole="button"
        accessibilityLabel={
          visiblePassword ? 'Hide password' : 'Show password'
        }
      >
        <Ionicons
          name={visiblePassword ? 'eye-off-outline' : 'eye-outline'}
          size={20}
          color={COLORS.muted}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={closeModal}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Pressable
          style={styles.backdrop}
          onPress={closeModal}
          accessibilityLabel="Close authentication"
        />

        <KeyboardAvoidingView
          style={styles.keyboardArea}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View
            style={[
              styles.panel,
              {
                paddingBottom: Math.max(insets.bottom, 20) + 20,
              },
            ]}
          >
            <View style={styles.handle} />

            <View style={styles.header}>
              <View style={styles.logo}>
                <Ionicons
                  name="bag-handle-outline"
                  size={26}
                  color={COLORS.white}
                />
              </View>

              <Text style={styles.brandName}>ShopEase</Text>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeModal}
                disabled={submitting}
                accessibilityRole="button"
                accessibilityLabel="Close login"
              >
                <Ionicons
                  name="close"
                  size={24}
                  color={COLORS.text}
                />
              </TouchableOpacity>
            </View>
            <ScrollView
                 ref={scrollViewRef}
                  keyboardShouldPersistTaps="handled"
                 showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.content}
             >
              <Text style={styles.title}>
                {isSignup ? 'Create Account' : 'Welcome Back'}
              </Text>

              {successMessage ? (
                <View style={styles.successBox}>
                  <Ionicons
                    name="checkmark-circle"
                    size={19}
                    color={COLORS.success}
                  />
                  <Text style={styles.successText}>
                    {successMessage}
                  </Text>
                </View>
              ) : (
                <Text style={styles.subtitle}>
                  {isSignup
                    ? 'Create your account and start shopping.'
                    : 'Sign in to continue shopping with ShopEase.'}
                </Text>
              )}

              {errorMessage ? (
                <View style={styles.errorBox}>
                  <Ionicons
                    name="alert-circle-outline"
                    size={18}
                    color="#D64545"
                  />
                  <Text style={styles.errorText}>
                    {errorMessage}
                  </Text>
                </View>
              ) : null}

              {isSignup && (
                <>
                  <Text style={styles.label}>Full Name</Text>

                  <View style={styles.inputBox}>
                    <Ionicons
                      name="person-outline"
                      size={19}
                      color={COLORS.muted}
                    />

                    <TextInput
                      style={styles.input}
                      placeholder="Enter your full name"
                      placeholderTextColor={COLORS.muted}
                      value={name}
                      onChangeText={setName}
                      autoCapitalize="words"
                      returnKeyType="next"
                    />
                  </View>
                </>
              )}

              <Text style={styles.label}>Email Address</Text>

              <View style={styles.inputBox}>
                <Ionicons
                  name="mail-outline"
                  size={19}
                  color={COLORS.muted}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor={COLORS.muted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                />
              </View>

              <Text style={styles.label}>Password</Text>

              {renderPasswordInput(
                password,
                setPassword,
                showPassword,
                setShowPassword,
                'Enter your password'
              )}

              {isSignup && password.length > 0 && (
                <View style={styles.strengthContainer}>
                  <View style={styles.strengthHeader}>
                    <Text style={styles.strengthLabel}>
                      Password strength
                    </Text>

                    <Text
                      style={[
                        styles.strengthValue,
                        { color: strengthColor },
                      ]}
                    >
                      {passwordStrength}
                    </Text>
                  </View>

                  <View style={styles.strengthTrack}>
                    {[1, 2, 3, 4, 5].map((level) => (
                      <View
                        key={level}
                        style={[
                          styles.strengthSegment,
                          level <= strengthScore && {
                            backgroundColor: strengthColor,
                          },
                        ]}
                      />
                    ))}
                  </View>

                  <Text style={styles.helperText}>
                    Use 8+ characters with uppercase, lowercase, numbers
                    and symbols for a stronger password.
                  </Text>
                </View>
              )}

              {isSignup && (
                <>
                  <Text style={styles.label}>Confirm Password</Text>

                  {renderPasswordInput(
                    confirmPassword,
                    setConfirmPassword,
                    showConfirmPassword,
                    setShowConfirmPassword,
                    'Re-enter your password'
                  )}

                  {confirmPassword.length > 0 && (
                    <View style={styles.matchRow}>
                      <Ionicons
                        name={
                          password === confirmPassword
                            ? 'checkmark-circle'
                            : 'close-circle'
                        }
                        size={16}
                        color={
                          password === confirmPassword
                            ? COLORS.success
                            : '#D64545'
                        }
                      />

                      <Text
                        style={[
                          styles.matchText,
                          {
                            color:
                              password === confirmPassword
                                ? COLORS.success
                                : '#D64545',
                          },
                        ]}
                      >
                        {password === confirmPassword
                          ? 'Passwords match'
                          : 'Passwords do not match'}
                      </Text>
                    </View>
                  )}

                  <Pressable
                    style={styles.termsRow}
                    onPress={() =>
                      setAgreeToTerms((previous) => !previous)
                    }
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: agreeToTerms }}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        agreeToTerms && styles.checkboxChecked,
                      ]}
                    >
                      {agreeToTerms && (
                        <Ionicons
                          name="checkmark"
                          size={13}
                          color={COLORS.white}
                        />
                      )}
                    </View>

                    <Text style={styles.termsText}>
                      I agree to the{' '}
                      <Text style={styles.termsHighlight}>
                        Terms and Conditions
                      </Text>{' '}
                      and Privacy Policy.
                    </Text>
                  </Pressable>
                </>
              )}

              {!isSignup && (
                <View style={styles.optionsRow}>
                  <TouchableOpacity
                    style={styles.rememberRow}
                    onPress={() =>
                      setRememberMe((previous) => !previous)
                    }
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: rememberMe }}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        rememberMe && styles.checkboxChecked,
                      ]}
                    >
                      {rememberMe && (
                        <Ionicons
                          name="checkmark"
                          size={13}
                          color={COLORS.white}
                        />
                      )}
                    </View>

                    <Text style={styles.optionText}>Remember me</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={handleForgotPassword}>
                    <Text style={styles.forgotText}>
                      Forgot Password?
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  submitting && styles.disabledButton,
                ]}
                onPress={handleSubmit}
                disabled={submitting}
                activeOpacity={0.85}
              >
                <Text style={styles.submitText}>
                  {submitting
                    ? 'Please wait...'
                    : isSignup
                    ? 'Create Account'
                    : 'Login'}
                </Text>

                {!submitting && (
                  <Ionicons
                    name="arrow-forward"
                    size={19}
                    color={COLORS.white}
                  />
                )}
              </TouchableOpacity>

              {!isSignup && (
                <>
                  <View style={styles.orRow}>
                    <View style={styles.orLine} />
                    <Text style={styles.orText}>OR</Text>
                    <View style={styles.orLine} />
                  </View>

                  <TouchableOpacity
                    style={styles.googleButton}
                    onPress={handleGoogleLogin}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name="logo-google"
                      size={20}
                      color="#4285F4"
                    />

                    <Text style={styles.googleText}>
                      Continue with Google
                    </Text>
                  </TouchableOpacity>
                </>
              )}

              <View style={styles.switchRow}>
                <Text style={styles.switchText}>
                  {isSignup
                    ? 'Already have an account? '
                    : "Don't have an account? "}
                </Text>

                <TouchableOpacity
                  onPress={switchMode}
                  disabled={submitting}
                >
                  <Text style={styles.switchLink}>
                    {isSignup ? 'Login' : 'Sign Up'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.securityRow}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={19}
                  color={COLORS.success}
                />

                <Text style={styles.securityText}>
                  Your details are safe and secure
                </Text>
              </View>

              <Text style={styles.footer}>
                SHOP WITH CONFIDENCE
              </Text>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(40, 34, 31, 0.48)',
    justifyContent: 'flex-end',
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },

  keyboardArea: {
    justifyContent: 'flex-end',
  },

  panel: {
    backgroundColor: COLORS.cream,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 20,
    maxHeight: '90%',
  },

  handle: {
    width: 42,
    height: 4,
    borderRadius: 5,
    backgroundColor: COLORS.border,
    alignSelf: 'center',
    marginBottom: 20,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },

  logo: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  brandName: {
    flex: 1,
    color: COLORS.text,
    fontSize: 19,
    fontWeight: '700',
    marginLeft: 12,
  },

  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    paddingBottom: 12,
  },

  title: {
    color: COLORS.text,
    fontSize: 27,
    fontWeight: '700',
    marginBottom: 8,
  },

  subtitle: {
    color: COLORS.secondaryText,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 24,
  },

  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6EFE5',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },

  successText: {
    flex: 1,
    color: COLORS.success,
    fontSize: 13,
    fontWeight: '600',
  },

  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FCEAEA',
    borderWidth: 1,
    borderColor: '#F3CACA',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },

  errorText: {
    flex: 1,
    color: '#B42323',
    fontSize: 13,
    lineHeight: 19,
  },

  label: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },

  inputBox: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 13,
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 18,
    gap: 10,
  },

  input: {
    flex: 1,
    color: COLORS.text,
    fontSize: 14,
    paddingVertical: 12,
  },

  strengthContainer: {
    marginTop: -10,
    marginBottom: 18,
  },

  strengthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  strengthLabel: {
    color: COLORS.secondaryText,
    fontSize: 12,
  },

  strengthValue: {
    fontSize: 12,
    fontWeight: '700',
  },

  strengthTrack: {
    flexDirection: 'row',
    gap: 5,
    marginBottom: 8,
  },

  strengthSegment: {
    flex: 1,
    height: 5,
    borderRadius: 5,
    backgroundColor: COLORS.border,
  },

  helperText: {
    color: COLORS.secondaryText,
    fontSize: 11,
    lineHeight: 16,
  },

  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: -10,
    marginBottom: 18,
  },

  matchText: {
    fontSize: 12,
    fontWeight: '500',
  },

  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 2,
    marginBottom: 20,
  },

  termsText: {
    flex: 1,
    color: COLORS.secondaryText,
    fontSize: 12,
    lineHeight: 19,
  },

  termsHighlight: {
    color: COLORS.primary,
    fontWeight: '700',
  },

  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },

  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  checkbox: {
    width: 19,
    height: 19,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
  },

  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  optionText: {
    color: COLORS.text,
    fontSize: 12,
  },

  forgotText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '600',
  },

  submitButton: {
    backgroundColor: COLORS.primary,
    minHeight: 53,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 6,
  },

  disabledButton: {
    opacity: 0.6,
  },

  submitText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },

  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 20,
  },

  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },

  orText: {
    color: COLORS.muted,
    fontSize: 11,
  },

  googleButton: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    backgroundColor: COLORS.surface,
  },

  googleText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },

  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 24,
  },

  switchText: {
    color: COLORS.secondaryText,
    fontSize: 13,
  },

  switchLink: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '700',
  },

  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 22,
  },

  securityText: {
    color: COLORS.success,
    fontSize: 12,
    fontWeight: '500',
  },

  footer: {
    textAlign: 'center',
    color: COLORS.secondaryText,
    fontSize: 10,
    letterSpacing: 1,
    marginTop: 20,
  },
});
