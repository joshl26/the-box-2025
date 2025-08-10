-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS grows CASCADE;

-- Main grows table
CREATE TABLE grows (
    "Id" SERIAL PRIMARY KEY,
    strain VARCHAR(255) NOT NULL,
    grow_notes VARCHAR(255),
    sunrise_time_veg INTEGER DEFAULT 0,
	sunset_time_veg INTEGER DEFAULT 0,
    sunrise_time_flower INTEGER DEFAULT 0,
	sunset_time_flower INTEGER DEFAULT 0,
    number_of_pots INTEGER DEFAULT 0,
    pot_volume INTEGER DEFAULT 0,
    p1_start_time_growth INTEGER DEFAULT 0,
    p1_num_shots_growth INTEGER DEFAULT 0,
    p1_shot_size_growth INTEGER DEFAULT 0,
    p2_start_time_growth INTEGER DEFAULT 0,
    p2_num_shots_growth INTEGER DEFAULT 0,
    p2_shot_size_growth INTEGER DEFAULT 0,
    p3_start_time_growth INTEGER DEFAULT 0,
    p3_num_shots_growth INTEGER DEFAULT 0,
    p3_shot_size_growth INTEGER DEFAULT 0,
    p1_start_time_flower_start INTEGER DEFAULT 0,
    p1_num_shots_flower_start INTEGER DEFAULT 0,
    p1_shot_size_flower_start INTEGER DEFAULT 0,
    p2_start_time_flower_start INTEGER DEFAULT 0,
    p2_num_shots_flower_start INTEGER DEFAULT 0,
    p2_shot_size_flower_start INTEGER DEFAULT 0,
    p3_start_time_flower_start INTEGER DEFAULT 0,
    p3_num_shots_flower_start INTEGER DEFAULT 0,
    p3_shot_size_flower_start INTEGER DEFAULT 0,
    p1_start_time_flower_middle INTEGER DEFAULT 0,
    p1_num_shots_flower_middle INTEGER DEFAULT 0,
    p1_shot_size_flower_middle INTEGER DEFAULT 0,
    p2_start_time_flower_middle INTEGER DEFAULT 0,
    p2_num_shots_flower_middle INTEGER DEFAULT 0,
    p2_shot_size_flower_middle INTEGER DEFAULT 0,
    p3_start_time_flower_middle INTEGER DEFAULT 0,
    p3_num_shots_flower_middle INTEGER DEFAULT 0,
    p3_shot_size_flower_middle INTEGER DEFAULT 0,
    p1_start_time_flower_end INTEGER DEFAULT 0,
    p1_num_shots_flower_end INTEGER DEFAULT 0,
    p1_shot_size_flower_end INTEGER DEFAULT 0,
    p2_start_time_flower_end INTEGER DEFAULT 0,
    p2_num_shots_flower_end INTEGER DEFAULT 0,
    p2_shot_size_flower_end INTEGER DEFAULT 0,
    p3_start_time_flower_end INTEGER DEFAULT 0,
    p3_num_shots_flower_end INTEGER DEFAULT 0,
    p3_shot_size_flower_end INTEGER DEFAULT 0,
    flower_start_date DATE,
    flower_end_date DATE,
    breeder_name VARCHAR(255),
    grower_name VARCHAR(255),
    currently_selected VARCHAR(255) DEFAULT false,
    grow_finished VARCHAR(255) DEFAULT false,
    growth_cycle VARCHAR(255) DEFAULT 'veg_growth'
);

-- Insert sample data
INSERT INTO grows 
(
    "strain",
    "grow_notes",
    "sunrise_time_veg",
    "sunset_time_veg",
    "sunrise_time_flower",
    "sunset_time_flower",
    "number_of_pots",
    "pot_volume",
    "p1_start_time_growth",
    "p1_num_shots_growth",
    "p1_shot_size_growth",
    "p2_start_time_growth",
    "p2_num_shots_growth",
    "p2_shot_size_growth",
    "p3_start_time_growth",
    "p3_num_shots_growth",
    "p3_shot_size_growth",
    "p1_start_time_flower_start",
    "p1_num_shots_flower_start",
    "p1_shot_size_flower_start",
    "p2_start_time_flower_start",
    "p2_num_shots_flower_start",
    "p2_shot_size_flower_start",
    "p3_start_time_flower_start",
    "p3_num_shots_flower_start",
    "p3_shot_size_flower_start",
    "p1_start_time_flower_middle",
    "p1_num_shots_flower_middle",
    "p1_shot_size_flower_middle",
    "p2_start_time_flower_middle",
    "p2_num_shots_flower_middle",
    "p2_shot_size_flower_middle",
    "p3_start_time_flower_middle",
    "p3_num_shots_flower_middle",
    "p3_shot_size_flower_middle",
    "p1_start_time_flower_end",
    "p1_num_shots_flower_end",
    "p1_shot_size_flower_end",
    "p2_start_time_flower_end",
    "p2_num_shots_flower_end",
    "p2_shot_size_flower_end",
    "p3_start_time_flower_end",
    "p3_num_shots_flower_end",
    "p3_shot_size_flower_end",
    "vegetative_start_date",
    "flower_start_date",
    "flower_end_date",
    "breeder_name",
    "grower_name",
    "currently_selected",
    "grow_finished",
    "growth_cycle"
) 
VALUES[
    ('Blue Dream', 'First hydroponic grow attempt. Using DWC system.', '16:00:00', '10:00:00', '16:00:00', '4:00:00', 2, 8390, '0:00:00', 0, 0, '0:00:00', 0, 0, '0:00:00', 0, 0, '0:00:00', 0, 0, '0:00:00', 0, 0, '0:00:00', 0, 0, '0:00:00', 0, 0, '0:00:00', 0, 0, '0:00:00', 0, 0, '0:00:00', 0, 0, '0:00:00', 0, 0, '0:00:00', 0, 0, '2025-1-1', '2025-1-1', '2025-1-1', '34th St. Seeds', 'Josh','true', 'false', 'veg_growth'),
    ('Northern Lights', 'Second grow with improved nutrient schedule.', '0:00:00', '0:00:00', '0:00:00', '0:00:00', 2, 8390, '0:00:00', 0, 0, '0:00:00', 0, 0, '0:00:00', 0, 0, '0:00:00', 0, 0, '0:00:00', 0, 0, '0:00:00', 0, 0, '0:00:00', 0, 0, '0:00:00', 0, 0, '0:00:00', 0, 0, '0:00:00', 0, 0, '0:00:00', 0, 0, '0:00:00', 0, 0, '2025-1-1', '2025-1-1', '2025-1-1', 'Saggarita Seed Co.', 'Josh','false', 'false', 'veg_growth'),
    ('White Widow', 'Experimental grow with LED lighting.', '0:00:00', '0:00:00', '0:00:00', '0:00:00', 2, 8390, '0:00:00', 0, 0, '0:00:00', 0, 0, '0:00:00', 0, 0, '0:00:00', 0, 0, '0:00:00', 0, 0, '0:00:00', 0, 0, '0:00:00', 0, 0, '0:00:00', 0, 0, '0:00:00', 0, 0, '0:00:00', 0, 0, '0:00:00', 0, 0, '0:00:00', 0, 0, '2025-1-1', '2025-1-1', '2025-1-1', 'Dutch Passion Seed Co.', 'Josh','false', 'false', 'veg_growth')
];

DROP TABLE IF EXISTS sensor_data CASCADE;

CREATE TABLE sensor_data (
    time TIMESTAMPTZ NOT NULL,
    sensor_id INTEGER NOT NULL,
    value DOUBLE PRECISION,
    metadata JSONB
);

CREATE INDEX idx_sensor_data_time ON sensor_data (time DESC);
CREATE INDEX idx_sensor_data_sensor_id ON sensor_data (sensor_id);

CREATE EXTENSION IF NOT EXISTS timescaledb;

SELECT create_hypertable('sensor_data', 'time');

-- time='2025-8-9 23:41:00'
--     sensor_id_1 = 101
--     value = 550.00
--     metadata={'name': 'John Doe','age': 30, 'isStudent': 'false'}
--     insert_sensor_data(time, sensor_id_1, value, metadata)