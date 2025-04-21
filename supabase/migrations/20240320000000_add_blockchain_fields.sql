-- Add blockchain_id to discussion_threads
ALTER TABLE discussion_threads
ADD COLUMN blockchain_id text;

-- Add blockchain_id to thread_messages
ALTER TABLE thread_messages
ADD COLUMN blockchain_id text; 