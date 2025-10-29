-- Migration: add held_until column to bookings
ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS held_until TIMESTAMP;
