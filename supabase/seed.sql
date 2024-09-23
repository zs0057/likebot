-- 첫 번째 사용자
INSERT INTO auth.users (id)
VALUES (
  'f47ac10b-58cc-4372-a567-0e02b2c3d479'  -- 첫 번째 사용자 고유 ID(UUID 형식)
);

INSERT INTO profiles (id, created_at, nickname, push_option)
VALUES (
  'f47ac10b-58cc-4372-a567-0e02b2c3d479',  -- 첫 번째 사용자 고유 ID(UUID 형식)
  NOW(),                                   -- 현재 시간으로 생성 날짜 설정
  '지송빠레',                                -- 닉네임
  TRUE                                     -- 푸시 옵션: TRUE (BOOL)
);

-- 두 번째 사용자
INSERT INTO auth.users (id)
VALUES (
  'd87ac10b-58cc-4372-b789-0e02b2c3d480'  -- 두 번째 사용자 고유 ID(UUID 형식)
);

INSERT INTO profiles (id, created_at, nickname, push_option)
VALUES (
  'd87ac10b-58cc-4372-b789-0e02b2c3d480',  -- 두 번째 사용자 고유 ID(UUID 형식)
  NOW(),                                   -- 현재 시간으로 생성 날짜 설정
  '빠른토끼',                                -- 닉네임
  FALSE                                    -- 푸시 옵션: FALSE (BOOL)
);

-- 세 번째 사용자
INSERT INTO auth.users (id)
VALUES (
  'e37ac10b-58cc-4372-c567-0e02b2c3d481'  -- 세 번째 사용자 고유 ID(UUID 형식)
);

INSERT INTO profiles (id, created_at, nickname, push_option)
VALUES (
  'e37ac10b-58cc-4372-c567-0e02b2c3d481',  -- 세 번째 사용자 고유 ID(UUID 형식)
  NOW(),                                   -- 현재 시간으로 생성 날짜 설정
  '멋진사람',                                -- 닉네임
  TRUE                                     -- 푸시 옵션: TRUE (BOOL)
);

-- 첫 번째 사용자에 대한 2개의 feed 데이터
INSERT INTO feed (id, user_id, created_at, review, type, image_path, visibility, calorie)
VALUES 
  (uuid_generate_v4(), 'f47ac10b-58cc-4372-a567-0e02b2c3d479', NOW(), '맛있는 점심', 'lunch', 'path/to/image1.jpg', TRUE, 500),
  (uuid_generate_v4(), 'f47ac10b-58cc-4372-a567-0e02b2c3d479', NOW(), '다시 가고 싶은 맛집', 'lunch', 'path/to/image2.jpg', FALSE, 450);

-- 두 번째 사용자에 대한 2개의 feed 데이터
INSERT INTO feed (id, user_id, created_at, review, type, image_path, visibility, calorie)
VALUES 
  (uuid_generate_v4(), 'd87ac10b-58cc-4372-b789-0e02b2c3d480', NOW(), '점심은 간단하게 먹었어요', 'lunch', 'path/to/image3.jpg', TRUE, 300),
  (uuid_generate_v4(), 'd87ac10b-58cc-4372-b789-0e02b2c3d480', NOW(), '건강한 점심을 먹었습니다', 'lunch', 'path/to/image4.jpg', FALSE, 350);

-- 세 번째 사용자에 대한 2개의 feed 데이터
INSERT INTO feed (id, user_id, created_at, review, type, image_path, visibility, calorie)
VALUES 
  (uuid_generate_v4(), 'e37ac10b-58cc-4372-c567-0e02b2c3d481', NOW(), '점심으로 스테이크를 먹었어요', 'lunch', 'path/to/image5.jpg', TRUE, 700);

