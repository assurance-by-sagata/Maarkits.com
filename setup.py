from setuptools import setup, find_packages

setup(
    name='YourProjectName',
    version='1.0',
    packages=find_packages(),
    # List other dependencies of your project here
    install_requires=[
        # other dependencies...
    ],
    # This line includes your local flask_session as a package
    dependency_links=['./flask_session#egg=flask_session'],
)