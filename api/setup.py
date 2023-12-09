from setuptools import setup, find_packages

setup(
    name='YourProjectName',  # Replace with your project name
    version='1.0',          # Replace with your project version
    packages=find_packages(),
    install_requires=[
        # List your project dependencies here. For example:
        'Flask',
        # ... other dependencies if any
    ],
    # Including your local flask_session as a package
    dependency_links=['./flask_session#egg=flask_session'],
)