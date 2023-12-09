from setuptools import setup, find_packages

setup(
    name='Maarkits.com',
    version='1.0',    
    packages=find_packages(),
    install_requires=[
        'Flask',
        # ... other dependencies for later
    ],
    # Including local flask_session as a package
    dependency_links=['./flask_session#egg=flask_session'],
)