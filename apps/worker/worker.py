#!/usr/bin/env python
"""
RQ Worker for Sijadin
Run with: python worker.py
"""
import sys
import os

# Add parent directories to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../api')))

from redis import Redis
from rq import Worker, Queue, Connection
from worker.config import redis_conn

# Queues to listen to
QUEUES = ['default', 'high', 'low']

if __name__ == '__main__':
    print("🚀 Starting Sijadin Worker...")
    print(f"📋 Listening to queues: {', '.join(QUEUES)}")
    
    with Connection(redis_conn):
        worker = Worker(QUEUES)
        worker.work()
