from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from accounts.models import User
from courses.models import Course, Section, Chapter
import io
from PIL import Image
from django.db import transaction


class Command(BaseCommand):
    help = 'Populate database with 3 sample courses with sections and chapters'

    def handle(self, *args, **kwargs):
        # Clear existing courses to avoid duplicates
        Course.objects.all().delete()
        self.stdout.write(self.style.WARNING('Cleared existing courses'))
        
        # Get or create a creator user
        creator, created = User.objects.get_or_create(
            email='creator@example.com',
            defaults={
                'user_name': 'creator',
                'is_staff': True,
            }
        )
        if created:
            creator.set_password('password123')
            creator.save()
            self.stdout.write(self.style.SUCCESS(f'Created user: {creator.email}'))
        else:
            self.stdout.write(self.style.WARNING(f'User already exists: {creator.email}'))

        # Create a simple thumbnail image
        def create_thumbnail():
            img = Image.new('RGB', (300, 200), color=(73, 109, 137))
            img_io = io.BytesIO()
            img.save(img_io, format='PNG')
            img_io.seek(0)
            return ContentFile(img_io.read(), name='thumbnail.png')

        # Course 1: Python Programming for Beginners
        course1, created = Course.objects.get_or_create(
            title='Python Programming for Beginners',
            defaults={
                'creator': creator,
                'description': 'Learn Python programming from scratch. Perfect for absolute beginners who want to master one of the most popular programming languages.',
                'requirements': 'No prior programming experience required. Just bring your enthusiasm to learn!',
                'total_hours': 0.0,
            }
        )
        if created:
            course1.thumbnail = create_thumbnail()
            course1.save()
            self.stdout.write(self.style.SUCCESS(f'Created course: {course1.title}'))

            # Section 1: Introduction to Python
            section1_1 = Section.objects.create(
                course=course1,
                title='Introduction to Python',
                order=1
            )
            Chapter.objects.create(
                section=section1_1,
                title='Your First Python Program',
                video_url='https://example.com/videos/first-program',
                video_duration=0.5
            )
            Chapter.objects.create(
                section=section1_1,
                title='Installing Python and Setting Up Your Environment',
                video_url='https://example.com/videos/python-setup',
                video_duration=0.75
            )
            Chapter.objects.create(
                section=section1_1,
                title='What is Python?',
                video_url='https://example.com/videos/python-intro',
                video_duration=0.5
            )

            # Section 2: Python Basics
            section1_2 = Section.objects.create(
                course=course1,
                title='Python Basics',
                order=2
            )
            Chapter.objects.create(
                section=section1_2,
                title='Control Flow: If Statements',
                video_url='https://example.com/videos/if-statements',
                video_duration=1.25
            )
            Chapter.objects.create(
                section=section1_2,
                title='Operators and Expressions',
                video_url='https://example.com/videos/operators',
                video_duration=0.75
            )
            Chapter.objects.create(
                section=section1_2,
                title='Variables and Data Types',
                video_url='https://example.com/videos/variables',
                video_duration=1.0
            )

            # Section 3: Functions and Loops
            section1_3 = Section.objects.create(
                course=course1,
                title='Functions and Loops',
                order=3
            )
            Chapter.objects.create(
                section=section1_3,
                title='While Loops',
                video_url='https://example.com/videos/while-loops',
                video_duration=0.75
            )
            Chapter.objects.create(
                section=section1_3,
                title='For Loops',
                video_url='https://example.com/videos/for-loops',
                video_duration=1.0
            )
            Chapter.objects.create(
                section=section1_3,
                title='Introduction to Functions',
                video_url='https://example.com/videos/functions',
                video_duration=1.5
            )

        # Course 2: Web Development with Django
        course2, created = Course.objects.get_or_create(
            title='Web Development with Django',
            defaults={
                'creator': creator,
                'description': 'Master Django framework and build powerful web applications. Learn from basics to advanced concepts.',
                'requirements': 'Basic Python knowledge required. Familiarity with HTML/CSS is helpful but not required.',
                'total_hours': 0.0,
            }
        )
        if created:
            course2.thumbnail = create_thumbnail()
            course2.save()
            self.stdout.write(self.style.SUCCESS(f'Created course: {course2.title}'))

            # Section 1: Django Fundamentals
            section2_1 = Section.objects.create(
                course=course2,
                title='Django Fundamentals',
                order=1
            )
            Chapter.objects.create(
                section=section2_1,
                title='What is Django?',
                video_url='https://example.com/videos/django-intro',
                video_duration=0.5,
                order=1
            )
            Chapter.objects.create(
                section=section2_1,
                title='Installing Django and Creating Your First Project',
                video_url='https://example.com/videos/django-setup',
                video_duration=1.0,
                order=2
            )
            Chapter.objects.create(
                section=section2_1,
                title='Understanding Django Project Structure',
                video_url='https://example.com/videos/django-structure',
                video_duration=0.75,
                order=3
            )

            # Section 2: Models and Databases
            section2_2 = Section.objects.create(
                course=course2,
                title='Models and Databases',
                order=2
            )
            Chapter.objects.create(
                section=section2_2,
                title='Introduction to Django Models',
                video_url='https://example.com/videos/django-models',
                video_duration=1.5,
                order=1
            )
            Chapter.objects.create(
                section=section2_2,
                title='Database Migrations',
                video_url='https://example.com/videos/migrations',
                video_duration=1.0,
                order=2
            )
            Chapter.objects.create(
                section=section2_2,
                title='QuerySets and Database Operations',
                video_url='https://example.com/videos/querysets',
                video_duration=2.0,
                order=3
            )

            # Section 3: Views and Templates
            section2_3 = Section.objects.create(
                course=course2,
                title='Views and Templates',
                order=3
            )
            Chapter.objects.create(
                section=section2_3,
                title='Django Views Explained',
                video_url='https://example.com/videos/django-views',
                video_duration=1.25,
                order=1
            )
            Chapter.objects.create(
                section=section2_3,
                title='Django Template Language',
                video_url='https://example.com/videos/templates',
                video_duration=1.5,
                order=2
            )
            Chapter.objects.create(
                section=section2_3,
                title='Building Dynamic Web Pages',
                video_url='https://example.com/videos/dynamic-pages',
                video_duration=2.0,
                order=3
            )

        # Course 3: React.js - Modern Frontend Development
        course3, created = Course.objects.get_or_create(
            title='React.js - Modern Frontend Development',
            defaults={
                'creator': creator,
                'description': 'Build interactive user interfaces with React.js. Learn hooks, state management, and modern React patterns.',
                'requirements': 'JavaScript fundamentals required. Knowledge of ES6+ features is recommended.',
                'total_hours': 0.0,
            }
        )
        if created:
            course3.thumbnail = create_thumbnail()
            course3.save()
            self.stdout.write(self.style.SUCCESS(f'Created course: {course3.title}'))

            # Section 1: React Basics
            section3_1 = Section.objects.create(
                course=course3,
                title='React Basics',
                order=1
            )
            Chapter.objects.create(
                section=section3_1,
                title='Introduction to React',
                video_url='https://example.com/videos/react-intro',
                video_duration=0.5,
                order=1
            )
            Chapter.objects.create(
                section=section3_1,
                title='Setting Up React Development Environment',
                video_url='https://example.com/videos/react-setup',
                video_duration=1.0,
                order=2
            )
            Chapter.objects.create(
                section=section3_1,
                title='JSX and Components',
                video_url='https://example.com/videos/jsx-components',
                video_duration=1.5,
                order=3
            )

            # Section 2: React Hooks
            section3_2 = Section.objects.create(
                course=course3,
                title='React Hooks',
                order=2
            )
            Chapter.objects.create(
                section=section3_2,
                title='Understanding useState Hook',
                video_url='https://example.com/videos/usestate',
                video_duration=1.25,
                order=1
            )
            Chapter.objects.create(
                section=section3_2,
                title='useEffect for Side Effects',
                video_url='https://example.com/videos/useeffect',
                video_duration=1.5,
                order=2
            )
            Chapter.objects.create(
                section=section3_2,
                title='Custom Hooks',
                video_url='https://example.com/videos/custom-hooks',
                video_duration=2.0,
                order=3
            )

            # Section 3: State Management
            section3_3 = Section.objects.create(
                course=course3,
                title='State Management',
                order=3
            )
            Chapter.objects.create(
                section=section3_3,
                title='Managing Complex State with useReducer',
                video_url='https://example.com/videos/usereducer',
                video_duration=1.75,
                order=1
            )
            Chapter.objects.create(
                section=section3_3,
                title='Context API for Global State',
                video_url='https://example.com/videos/context-api',
                video_duration=2.0,
                order=2
            )
            Chapter.objects.create(
                section=section3_3,
                title='Introduction to Redux',
                video_url='https://example.com/videos/redux-intro',
                video_duration=2.5,
                order=3
            )

        self.stdout.write(self.style.SUCCESS('\n✅ Successfully populated database with 3 courses!'))
        self.stdout.write(self.style.SUCCESS(f'   - {course1.title} ({course1.total_hours} hours)'))
        self.stdout.write(self.style.SUCCESS(f'   - {course2.title} ({course2.total_hours} hours)'))
        self.stdout.write(self.style.SUCCESS(f'   - {course3.title} ({course3.total_hours} hours)'))
