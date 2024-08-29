const AppError = require("../../../models/app_error");
const User = require("../../user/models/user");
const getDashboard = (req, res, next) => {
    try {
        const user = req.user;
        if (user.role === 'manager') {
            return getManagerDashboard(user, req, res, next);
        } else if (user.role === 'employee') {
            return getEmployeeDashboard(user, req, res, next);
        } else {
            return new AppError('Invalid user type', 404);
        }
    } catch (err) {
        next(err);
    }
}

const getEmployeeDashboard = async (user, req, res, next) => {
    const employee = await User.findById(user._id);
    const isPresence = employee.presence;
    return res.success({isPresence: isPresence});
}

const getManagerDashboard = async (user, req, res, next) => {
    const employees = await User.find({managerId: user.id});
    const absentees = employees.filter(item => item.presence === false);
    const absences = employees.filter(item => item.presence === true);

    return res.success({
        personnelCount: employees.length,
        absencesCount: absences.length,
        absenteesCount: absentees.length,
        absences: absences.length > 10 ? absences.slice(0, 10) : absences,
        absentees: absentees.length > 10 ? absentees.slice(0, 10) : absentees,
    });
}
module.exports = {getDashboard}