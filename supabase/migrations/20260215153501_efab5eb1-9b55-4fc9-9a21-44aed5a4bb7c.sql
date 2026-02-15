
-- 1. Consumer Bill Detail
CREATE TABLE public.consumer_bill_detail (
  bill_sequence BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  consumer_number UUID NOT NULL REFERENCES public.consumers(id) ON DELETE CASCADE,
  bill_date DATE NOT NULL,
  bill_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  due_date DATE NOT NULL,
  prompt_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  prompt_date DATE NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Consumer Payment Detail
CREATE TABLE public.consumer_payment_detail (
  payment_sequence BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  consumer_number UUID NOT NULL REFERENCES public.consumers(id) ON DELETE CASCADE,
  entry_date_time TIMESTAMPTZ NOT NULL DEFAULT now(),
  payment_date_time TIMESTAMPTZ NOT NULL,
  amount_paid NUMERIC(12,2) NOT NULL DEFAULT 0,
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for fast queries
CREATE INDEX idx_consumer_bill_detail_consumer ON public.consumer_bill_detail(consumer_number);
CREATE INDEX idx_consumer_bill_detail_due_date ON public.consumer_bill_detail(due_date);
CREATE INDEX idx_consumer_payment_detail_consumer ON public.consumer_payment_detail(consumer_number);
CREATE INDEX idx_consumer_payment_detail_payment_dt ON public.consumer_payment_detail(payment_date_time);

-- RLS for consumer_bill_detail
ALTER TABLE public.consumer_bill_detail ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bill details"
  ON public.consumer_bill_detail FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all bill details"
  ON public.consumer_bill_detail FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS for consumer_payment_detail
ALTER TABLE public.consumer_payment_detail ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payment details"
  ON public.consumer_payment_detail FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payment details"
  ON public.consumer_payment_detail FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all payment details"
  ON public.consumer_payment_detail FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));
