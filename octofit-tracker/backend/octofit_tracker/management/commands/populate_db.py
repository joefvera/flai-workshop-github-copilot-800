from django.core.management.base import BaseCommand
from octofit_tracker.models import User, Team, Activity, Leaderboard, Workout
from datetime import date


class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Deleting existing data...')
        Leaderboard.objects.all().delete()
        Activity.objects.all().delete()
        Team.objects.all().delete()
        User.objects.all().delete()
        Workout.objects.all().delete()

        self.stdout.write('Creating users (superheroes)...')
        users = [
            User(name='Tony Stark', email='tony@avengers.com', password='ironman123', age=45),
            User(name='Steve Rogers', email='steve@avengers.com', password='cap123', age=105),
            User(name='Natasha Romanoff', email='natasha@avengers.com', password='widow123', age=38),
            User(name='Thor Odinson', email='thor@avengers.com', password='hammer123', age=1500),
            User(name='Bruce Wayne', email='bruce@gotham.com', password='batman123', age=40),
            User(name='Clark Kent', email='clark@dailyplanet.com', password='superman123', age=35),
            User(name='Diana Prince', email='diana@themyscira.com', password='wonder123', age=800),
            User(name='Barry Allen', email='barry@ccpd.com', password='flash123', age=28),
        ]
        for u in users:
            u.save()
        self.stdout.write(self.style.SUCCESS(f'Created {len(users)} users'))

        self.stdout.write('Creating teams...')
        marvel_members = [
            str(User.objects.get(email='tony@avengers.com').pk),
            str(User.objects.get(email='steve@avengers.com').pk),
            str(User.objects.get(email='natasha@avengers.com').pk),
            str(User.objects.get(email='thor@avengers.com').pk),
        ]
        dc_members = [
            str(User.objects.get(email='bruce@gotham.com').pk),
            str(User.objects.get(email='clark@dailyplanet.com').pk),
            str(User.objects.get(email='diana@themyscira.com').pk),
            str(User.objects.get(email='barry@ccpd.com').pk),
        ]
        Team(name='Team Marvel', members=marvel_members).save()
        Team(name='Team DC', members=dc_members).save()
        self.stdout.write(self.style.SUCCESS('Created 2 teams (Team Marvel, Team DC)'))

        self.stdout.write('Creating activities...')
        activities = [
            Activity(user='Tony Stark', activity_type='Running', duration=30.0, date=date(2024, 1, 10)),
            Activity(user='Steve Rogers', activity_type='Weightlifting', duration=60.0, date=date(2024, 1, 11)),
            Activity(user='Natasha Romanoff', activity_type='Yoga', duration=45.0, date=date(2024, 1, 12)),
            Activity(user='Thor Odinson', activity_type='Hammer Training', duration=90.0, date=date(2024, 1, 13)),
            Activity(user='Bruce Wayne', activity_type='Martial Arts', duration=120.0, date=date(2024, 1, 10)),
            Activity(user='Clark Kent', activity_type='Flying', duration=20.0, date=date(2024, 1, 11)),
            Activity(user='Diana Prince', activity_type='Sword Training', duration=75.0, date=date(2024, 1, 12)),
            Activity(user='Barry Allen', activity_type='Speed Running', duration=10.0, date=date(2024, 1, 13)),
        ]
        for a in activities:
            a.save()
        self.stdout.write(self.style.SUCCESS(f'Created {len(activities)} activities'))

        self.stdout.write('Creating leaderboard...')
        leaderboard = [
            Leaderboard(user='Thor Odinson', score=950),
            Leaderboard(user='Steve Rogers', score=900),
            Leaderboard(user='Diana Prince', score=875),
            Leaderboard(user='Bruce Wayne', score=850),
            Leaderboard(user='Tony Stark', score=800),
            Leaderboard(user='Clark Kent', score=780),
            Leaderboard(user='Natasha Romanoff', score=750),
            Leaderboard(user='Barry Allen', score=720),
        ]
        for entry in leaderboard:
            entry.save()
        self.stdout.write(self.style.SUCCESS(f'Created {len(leaderboard)} leaderboard entries'))

        self.stdout.write('Creating workouts...')
        workouts = [
            Workout(name='Iron Man Circuit', description='High intensity full-body circuit training like Tony Stark', duration=45.0),
            Workout(name='Super Soldier Program', description='Captain America style strength and endurance training', duration=60.0),
            Workout(name='Black Widow Combat', description='Martial arts and agility training', duration=50.0),
            Workout(name='Thunder God Workout', description='Explosive power and strength training inspired by Thor', duration=75.0),
            Workout(name='Dark Knight Training', description='Batman style combat and endurance workout', duration=90.0),
            Workout(name='Speed Force Sprints', description='Ultra-fast interval training like The Flash', duration=30.0),
        ]
        for w in workouts:
            w.save()
        self.stdout.write(self.style.SUCCESS(f'Created {len(workouts)} workouts'))

        self.stdout.write(self.style.SUCCESS('Database population complete!'))
