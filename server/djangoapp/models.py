# Uncomment the following imports before adding the Model code

from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from datetime import date

# Create your models here.


class CarMake(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField()
    country_of_origin = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )
    founded_year = models.IntegerField(
        blank=True, null=True,
        validators=[
            MinValueValidator(1800),
            MaxValueValidator(date.today().year)
        ]
    )

    def __str__(self):
        return self.name


class CarModel(models.Model):
    car_make = models.ForeignKey(
        CarMake,
        on_delete=models.CASCADE,
        related_name='car_models'
    )
    dealer_id = models.IntegerField(blank=True, null=True)
    name = models.CharField(max_length=100)

    CAR_TYPES = [
        ('SEDAN', 'Sedan'),
        ('SUV', 'SUV'),
        ('WAGON', 'Wagon'),
        ('COUPE', 'Coupe'),
        ('CONVERTIBLE', 'Convertible'),
        ('TRUCK', 'Truck'),
        ('VAN', 'Van'),
        ('OTHER', 'Other')
    ]

    type = models.CharField(max_length=15, choices=CAR_TYPES, default='SEDAN')

    year = models.IntegerField(
        validators=[
            MaxValueValidator(date.today().year),
            MinValueValidator(1886)
        ]
    )

    def __str__(self):
        return f"{self.car_make.name} {self.name} ({self.year})"
