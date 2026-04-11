import mongoose from 'mongoose';

const betSchema = new mongoose.Schema(
  {
    league: {
      type: String,
      default: 'NBA',
      trim: true,
    },
    match: {
      type: String,
      required: [true, 'Match is required'],
      trim: true,
    },
    bet: {
      type: String,
      required: [true, 'Bet description is required'],
      trim: true,
    },
    odds: {
      type: Number,
      required: [true, 'Odds are required'],
      min: 1.0,
    },
    stake: {
      // số đơn vị cược (ví dụ: 1u, 2u...)
      type: Number,
      default: 1,
      min: 0.5,
    },
    confidence: {
      // độ tự tin từ 1-5 ⭐
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },
    note: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'win', 'lose', 'void', 'half_win', 'half_lose'],
      default: 'pending',
    },
    profit: {
      // lãi/lỗ tính bằng đơn vị (u). Tính sau khi resolve
      type: Number,
      default: null,
    },
    sentToDiscord: {
      type: Boolean,
      default: false,
    },
    gameTime: {
      // giờ đấu (optional)
      type: String,
      default: '',
    },
  },
  {
    timestamps: true, // createdAt, updatedAt tự động
  }
);

// ── Virtual: profit tự động khi lưu status ─────────────────
betSchema.pre('save', function (next) {
  if (this.isModified('status') && this.status !== 'pending') {
    switch (this.status) {
      case 'win':
        this.profit = +(this.stake * (this.odds - 1)).toFixed(2);
        break;
      case 'lose':
        this.profit = -this.stake;
        break;
      case 'void':
        this.profit = 0;
        break;
      case 'half_win':
        this.profit = +(this.stake * ((this.odds - 1) / 2)).toFixed(2);
        break;
      case 'half_lose':
        this.profit = -(this.stake / 2);
        break;
    }
  }
  next();
});

export default mongoose.model('Bet', betSchema);
