#!/usr/bin/env python
# -*- encoding: utf8 -*-
import sys
from setuptools import setup, find_packages
from backend import __version__
readme = open("README.md").read()

setup(
    name = "ov-representa",
    version = __version__,
    description = "Virtual office for electric market representation",
    author = "Som Energia",
    author_email = "itcrowd@somenergia.coop",
    url = 'https://github.com/Som-Energia/ov-representa',
    long_description = readme,
    long_description_content_type = 'text/markdown',
    license = 'GNU Affero General Public License v3 or later (GPLv3+)',
    packages=find_packages(exclude=['*[tT]est*']),
    python_requires='>=3.8',
    scripts=[
        'scripts/representa_api.py',
    ],
    install_requires=[
        'somutils',
        'fastapi',
        'fastapi-oauth2',
        'uvicorn[standard]',
        'consolemsg',
        'pytest',
        'pytest-cov',
        'httpx',
        'yamlns',
        'passlib', # local auth
        'python-multipart', # local auth
        'authlib', # remote auth
        'itsdangerous', # remote auth (via SessionMiddleware)
    ],
    classifiers = [
        'Programming Language :: Python',
        'Programming Language :: Python :: 2',
        'Environment :: Console',
        'Topic :: Software Development :: Libraries :: Python Modules',
        'Intended Audience :: Developers',
        'Development Status :: 5 - Production/Stable',
        'License :: OSI Approved :: GNU General Public License v3 or later (GPLv3+)',
        'Operating System :: OS Independent',
    ],
)

# vim: et ts=4 sw=4
