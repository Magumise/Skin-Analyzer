from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from django.core.mail import send_mail

class UserManager(BaseUserManager):
    """Custom user manager for email-based authentication"""
    
    def _create_user(self, email, password, username=None, **extra_fields):
        """
        Create and save a user with the given email and password.
        """
        if not email:
            raise ValueError('Users must have an email address')
        
        email = self.normalize_email(email)
        user = self.model(
            email=email,
            username=username,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, username=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, username, **extra_fields)

    def create_superuser(self, email, password, username=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
            
        return self._create_user(email, password, username, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    """
    Custom user model with email as the primary identifier.
    """
    
    # Required Fields
    email = models.EmailField(
        _('email address'),
        unique=True,
        error_messages={
            'unique': _("A user with that email already exists."),
        },
    )
    
    # Optional Fields
    username = models.CharField(
        _('username'),
        max_length=150,
        blank=True,
        null=True,
        help_text=_('Optional. 150 characters or fewer.'),
    )
    
    # Status Fields
    is_staff = models.BooleanField(
        _('staff status'),
        default=False,
        help_text=_('Designates whether the user can log into this admin site.'),
    )
    is_active = models.BooleanField(
        _('active'),
        default=True,
        help_text=_(
            'Designates whether this user should be treated as active. '
            'Unselect this instead of deleting accounts.'
        ),
    )
    date_joined = models.DateTimeField(_('date joined'), default=timezone.now)
    
    # Custom Fields for Your App
    ROLES = (
        ('USER', 'Regular User'),
        ('DERMA', 'Dermatologist'),
        ('ADMIN', 'Administrator'),
    )
    role = models.CharField(
        _('role'),
        max_length=5,
        choices=ROLES,
        default='USER',
    )
    is_verified = models.BooleanField(
        _('verified'),
        default=False,
        help_text=_('Designates whether this user has verified their email.'),
    )
    verification_token = models.CharField(
        _('verification token'),
        max_length=100,
        blank=True,
    )

    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    profile_picture = models.ImageField(upload_to='profiles/', blank=True, null=True)
    
    objects = UserManager()
    
    # Authentication Configuration
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    
    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')
        ordering = ['-date_joined']
    
    def __str__(self):
        return self.email
    
    def get_full_name(self):
        """
        Return the username if available, otherwise return email.
        """
        return self.username if self.username else self.email.split('@')[0]
    
    def get_short_name(self):
        """Return the short name for the user."""
        return self.get_full_name()
    
    def email_user(self, subject, message, from_email=None, **kwargs):
        """Send an email to this user."""
        send_mail(subject, message, from_email, [self.email], **kwargs)