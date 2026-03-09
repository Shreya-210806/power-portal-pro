
-- Consumer directory: pre-registered consumer records for validation
CREATE TABLE public.consumer_directory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consumer_number text UNIQUE NOT NULL,
  consumer_name text NOT NULL,
  email text NOT NULL,
  mobile text NOT NULL,
  sanction_load text NOT NULL DEFAULT '5 kW',
  service_connection_date date NOT NULL DEFAULT CURRENT_DATE,
  last_bill_amount numeric NOT NULL DEFAULT 0,
  due_date date NOT NULL DEFAULT (CURRENT_DATE + interval '30 days')::date,
  payment_status text NOT NULL DEFAULT 'Unpaid',
  registered boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.consumer_directory ENABLE ROW LEVEL SECURITY;

-- OTP verifications table
CREATE TABLE public.otp_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consumer_number text NOT NULL,
  otp text NOT NULL,
  expiry_time timestamptz NOT NULL,
  purpose text NOT NULL DEFAULT 'registration',
  verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.otp_verifications ENABLE ROW LEVEL SECURITY;
