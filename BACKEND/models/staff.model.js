const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const staffSchema = new mongoose.Schema({
    staffName: {
        type: String,
        required: [true, 'Staff name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    staffEmail: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        unique: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    staffContactNo: {
        type: String,
        required: [true, 'Contact number is required'],
        trim: true,
        match: [/^\d{10}$/, 'Contact number must be 10 digits']
    },
    staffAddress: {
        type: String,
        required: [true, 'Address is required'],
        trim: true,
        minlength: [5, 'Address must be at least 5 characters'],
        maxlength: [200, 'Address cannot exceed 200 characters']
    },
    staffAge: {
        type: Number,
        required: [true, 'Age is required'],
        min: [16, 'Staff must be at least 16 years old'],
        max: [70, 'Age cannot exceed 70 years'],
        validate: {
            validator: Number.isInteger,
            message: 'Age must be a whole number'
        }
    },
    staffGender: {
        type: String,
        required: [true, 'Gender is required'],
        trim: true,
        enum: ['Male', 'Female', 'Other']
    },
    staffSalaryPerHours: {
        type: Number,
        required: [true, 'Salary per hour is required'],
        min: [0, 'Salary cannot be negative'],
        validate: {
            validator: function(v) {
                return Number.isFinite(v) && v >= 0;
            },
            message: 'Salary must be a valid positive number'
        }
    },
    staffWorkedHours: {
        type: Number,
        required: [true, 'Worked hours is required'],
        min: [0, 'Worked hours cannot be negative'],
        max: [168, 'Worked hours cannot exceed 168 hours per week'],
        default: 0
    },
    staffRole: {
        type: String,
        enum: {
            values: ['admin', 'manager', 'chef', 'cashier', 'waiter', 'cleaner'],
            message: 'Role must be one of: admin, manager, chef, cashier, waiter, cleaner'
        },
        required: [true, 'Staff role is required'],
        default: 'cashier'
    },
    staffPassword: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false // Don't include password in queries by default
    },
    department: {
        type: String,
        enum: ['kitchen', 'service', 'management', 'cleaning'],
        required: [true, 'Department is required'],
        default: function() {
            const roleMap = {
                'chef': 'kitchen',
                'waiter': 'service',
                'cashier': 'service',
                'admin': 'management',
                'manager': 'management',
                'cleaner': 'cleaning'
            };
            return roleMap[this.staffRole] || 'service';
        }
    },
    employeeId: {
        type: String,
        unique: true,
        required: true
    },
    dateOfJoining: {
        type: Date,
        default: Date.now
    },
    shift: {
        type: String,
        enum: ['morning', 'afternoon', 'evening', 'night'],
        required: [true, 'Shift is required'],
        default: 'morning'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date
    },
    permissions: [{
        type: String,
        enum: ['read', 'write', 'delete', 'manage_orders', 'manage_inventory', 'manage_staff', 'view_reports']
    }]
}, {
    timestamps: true,
    toJSON: { 
        virtuals: true,
        transform: function(doc, ret) {
            delete ret.staffPassword;
            return ret;
        }
    },
    toObject: { virtuals: true }
});

// Pre-save middleware to hash password
staffSchema.pre('save', async function(next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('staffPassword')) return next();
    
    try {
        // Hash password with cost of 12
        const salt = await bcrypt.genSalt(12);
        this.staffPassword = await bcrypt.hash(this.staffPassword, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Pre-save middleware to generate employee ID
staffSchema.pre('save', async function(next) {
    if (this.isNew && !this.employeeId) {
        const year = new Date().getFullYear().toString().slice(-2);
        const roleCode = this.staffRole.substring(0, 3).toUpperCase();
        
        // Find the last employee of the same role
        const lastEmployee = await this.constructor.findOne({
            staffRole: this.staffRole
        }).sort({ createdAt: -1 });
        
        let sequence = 1;
        if (lastEmployee && lastEmployee.employeeId) {
            const lastSequence = parseInt(lastEmployee.employeeId.slice(-3));
            sequence = lastSequence + 1;
        }
        
        this.employeeId = `${roleCode}${year}${sequence.toString().padStart(3, '0')}`;
    }
    next();
});

// Method to compare password
staffSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.staffPassword);
};

// Virtual for total salary
staffSchema.virtual('totalSalary').get(function() {
    return this.staffSalaryPerHours * this.staffWorkedHours;
});

// Virtual for full employee info
staffSchema.virtual('employeeInfo').get(function() {
    return `${this.employeeId} - ${this.staffName} (${this.staffRole})`;
});

// Indexes for better performance
staffSchema.index({ staffRole: 1 });
staffSchema.index({ isActive: 1 });
staffSchema.index({ department: 1 });

const staffModel = mongoose.model('Staff', staffSchema);
module.exports = staffModel;