from django.urls import path
from accounts.views import (
    RegisterView, LoginView, Verify2FAView,
    PasswordResetRequestView, PasswordResetConfirmView, LogoutView,
    GoogleAuthView, UserPrivacyDataView, RevokeConsentView, DeleteAccountView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('google/', GoogleAuthView.as_view(), name='google-auth'),
    path('verify-2fa/', Verify2FAView.as_view(), name='verify-2fa'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password-reset-request'),
    path('password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    path('logout/', LogoutView.as_view(), name='logout'),

    # Endpoints LGPD
    path('privacy/data/', UserPrivacyDataView.as_view(), name='privacy-data'),
    path('privacy/revoke-consent/', RevokeConsentView.as_view(), name='privacy-revoke-consent'),
    path('privacy/delete-account/', DeleteAccountView.as_view(), name='privacy-delete-account'),
]