const AppError = require("../../../models/app_error");

const {Personnel, Manager} = require("../../user/models/user_model");

const getManagerDashboard = async (req, res, next) => {
    try {
        const user = req.user;
        const personnel = await Personnel.find({managerId: user.id});
        const absentees = personnel.filter(item => item.isPresence === false);
        const absences = personnel.filter(item => item.isPresence === true);

        return res.success({
            personnelCount: personnel.length,
            absencesCount: absences.length,
            absenteesCount: absentees.length,
            absences: absences.length > 10 ? absences.slice(0, 10) : absences,
            absentees: absentees.length > 10 ? absentees.slice(0, 10) : absentees,
        });
    } catch (err) {
        next(err);
    }
}
const getPersonnelDashboard = async (req, res, next) => {
    try {
        const user = req.user;
        const personnel = await Personnel.findById(user._id);
        const isPresence = personnel.isPresence;
        return res.success({isPresence: isPresence});
    } catch (err) {
        next(err);
    }
}

module.exports = {getPersonnelDashboard, getManagerDashboard}