from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import User, Team, Activity, Leaderboard, Workout
from datetime import date


class UserModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create(
            name='Tony Stark',
            email='tony@avengers.com',
            password='ironman123',
            age=45
        )

    def tearDown(self):
        User.objects.all().delete()

    def test_user_creation(self):
        self.assertEqual(self.user.name, 'Tony Stark')
        self.assertEqual(self.user.email, 'tony@avengers.com')
        self.assertEqual(self.user.age, 45)

    def test_user_str(self):
        self.assertEqual(str(self.user), 'Tony Stark')


class TeamModelTest(TestCase):
    def setUp(self):
        self.team = Team.objects.create(name='Team Marvel', members=[])

    def tearDown(self):
        Team.objects.all().delete()

    def test_team_creation(self):
        self.assertEqual(self.team.name, 'Team Marvel')

    def test_team_str(self):
        self.assertEqual(str(self.team), 'Team Marvel')


class ActivityModelTest(TestCase):
    def setUp(self):
        self.activity = Activity.objects.create(
            user='Tony Stark',
            activity_type='Running',
            duration=30.0,
            date=date(2024, 1, 10)
        )

    def tearDown(self):
        Activity.objects.all().delete()

    def test_activity_creation(self):
        self.assertEqual(self.activity.user, 'Tony Stark')
        self.assertEqual(self.activity.activity_type, 'Running')
        self.assertEqual(self.activity.duration, 30.0)


class LeaderboardModelTest(TestCase):
    def setUp(self):
        self.entry = Leaderboard.objects.create(user='Thor Odinson', score=950)

    def tearDown(self):
        Leaderboard.objects.all().delete()

    def test_leaderboard_creation(self):
        self.assertEqual(self.entry.user, 'Thor Odinson')
        self.assertEqual(self.entry.score, 950)

    def test_leaderboard_str(self):
        self.assertEqual(str(self.entry), 'Thor Odinson - 950')


class WorkoutModelTest(TestCase):
    def setUp(self):
        self.workout = Workout.objects.create(
            name='Iron Man Circuit',
            description='High intensity training',
            duration=45.0
        )

    def tearDown(self):
        Workout.objects.all().delete()

    def test_workout_creation(self):
        self.assertEqual(self.workout.name, 'Iron Man Circuit')
        self.assertEqual(self.workout.duration, 45.0)

    def test_workout_str(self):
        self.assertEqual(str(self.workout), 'Iron Man Circuit')


class UserAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create(
            name='Steve Rogers',
            email='steve@avengers.com',
            password='cap123',
            age=105
        )

    def tearDown(self):
        User.objects.all().delete()

    def test_list_users(self):
        url = reverse('user-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_retrieve_user(self):
        url = reverse('user-detail', args=[self.user.pk])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Steve Rogers')


class TeamAPITest(APITestCase):
    def setUp(self):
        self.team = Team.objects.create(name='Team DC', members=[])

    def tearDown(self):
        Team.objects.all().delete()

    def test_list_teams(self):
        url = reverse('team-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class ActivityAPITest(APITestCase):
    def setUp(self):
        self.activity = Activity.objects.create(
            user='Bruce Wayne',
            activity_type='Martial Arts',
            duration=120.0,
            date=date(2024, 1, 10)
        )

    def tearDown(self):
        Activity.objects.all().delete()

    def test_list_activities(self):
        url = reverse('activity-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class LeaderboardAPITest(APITestCase):
    def setUp(self):
        self.entry = Leaderboard.objects.create(user='Diana Prince', score=875)

    def tearDown(self):
        Leaderboard.objects.all().delete()

    def test_list_leaderboard(self):
        url = reverse('leaderboard-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class WorkoutAPITest(APITestCase):
    def setUp(self):
        self.workout = Workout.objects.create(
            name='Dark Knight Training',
            description='Batman style combat',
            duration=90.0
        )

    def tearDown(self):
        Workout.objects.all().delete()

    def test_list_workouts(self):
        url = reverse('workout-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class ApiRootTest(APITestCase):
    def test_api_root(self):
        url = reverse('api-root')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('users', response.data)
        self.assertIn('teams', response.data)
        self.assertIn('activities', response.data)
        self.assertIn('leaderboard', response.data)
        self.assertIn('workouts', response.data)
